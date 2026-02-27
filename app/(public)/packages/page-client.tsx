"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { SearchSortBar } from "@/components/search-sort-bar";
import { useI18n, getLocalizedContent } from "@/lib/i18n";
import type { TourPackage, PackageCategory, Location } from "@/lib/db";
import { cn } from "@/lib/utils";

const PACKAGE_SORT_DEFAULT = "priceAsc";

interface PackagesPageClientProps {
  packages: TourPackage[];
  categories: PackageCategory[];
  locations: Location[];
}

const CATEGORY_IMAGE_INTERVAL_MS = 4000;

function CategoryCard({
  title,
  imageUrl,
  imageUrls,
  isSelected,
  onClick,
  locale,
  size = "default",
}: {
  title: string;
  imageUrl: string | null;
  /** When multiple, backgrounds cycle with animation */
  imageUrls?: string[];
  isSelected: boolean;
  onClick: () => void;
  locale: string;
  size?: "default" | "large";
}) {
  const urls = imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (urls.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length);
    }, CATEGORY_IMAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [urls.length]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-end w-full rounded-2xl overflow-hidden",
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        isSelected && "ring-2 ring-primary ring-offset-2",
        size === "large"
          ? "min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]"
          : "min-h-[200px] sm:min-h-[240px]",
      )}
    >
      {/* Background image or gradient (single or cycling) + slow zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105",
            urls.length > 0 && "animate-slow-zoom-in",
          )}
        >
          {urls.length === 0 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #751f27 0%, #751f27 50%, #751f27 100%)",
              }}
            />
          ) : urls.length === 1 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${urls[0]})` }}
            />
          ) : (
            urls.map((url, i) => (
              <div
                key={url}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
                style={{
                  backgroundImage: `url(${url})`,
                  opacity: index % urls.length === i ? 1 : 0,
                  zIndex: index % urls.length === i ? 0 : -1,
                }}
              />
            ))
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Dark green wave at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-[#751f27] opacity-90"
        style={{ clipPath: "polygon(0 40%, 100% 20%, 100% 100%, 0 100%)" }}
      />

      {/* Lighter green wave accent */}
      <div
        className="absolute bottom-6 left-0 right-0 h-8 opacity-80"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(155, 37, 49, 0.4), transparent)",
          clipPath: "polygon(0 60%, 50% 40%, 100% 60%, 100% 100%, 0 100%)",
        }}
      />

      {/* Text overlay */}
      <div
        className={cn(
          "relative z-10 px-6 pb-8 pt-4",
          locale === "ar" ? "text-right" : "text-left",
          size === "large" ? "text-center" : "",
        )}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <span
          className={cn(
            "font-bold text-[#ffffff] drop-shadow-lg block",
            size === "large"
              ? "text-2xl sm:text-3xl lg:text-4xl"
              : "text-xl sm:text-2xl",
          )}
        >
          {title}
        </span>
      </div>
    </button>
  );
}

const LOCATIONS_VIEW = "locations" as const;
type ViewMode = "categories" | typeof LOCATIONS_VIEW | "category";

export function PackagesPageClient({
  packages,
  categories,
  locations,
}: PackagesPageClientProps) {
  const { t, locale } = useI18n();
  const [view, setView] = useState<ViewMode>("categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(PACKAGE_SORT_DEFAULT);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesCategory =
        !selectedCategoryId || pkg.category_id === selectedCategoryId;
      const matchesLocation =
        !selectedLocationId || pkg.location_id === selectedLocationId;
      return matchesCategory && matchesLocation;
    });
  }, [packages, selectedCategoryId, selectedLocationId]);

  const displayedPackages = useMemo(() => {
    let list = filteredPackages;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((pkg) => {
        const name = (locale === "ar" ? pkg.name_ar : pkg.name_en) ?? "";
        const short =
          (locale === "ar"
            ? pkg.short_description_ar
            : pkg.short_description_en) ?? "";
        const desc =
          (locale === "ar" ? pkg.description_ar : pkg.description_en) ?? "";
        const loc =
          (locale === "ar" ? pkg.location_ar : pkg.location_en) ?? "";
        const type = pkg.package_type ?? "";
        const duration = (pkg.duration_days ?? "").toString();
        const price = (pkg.price ?? "").toString();
        const searchable = [
          name,
          short,
          desc,
          loc,
          type,
          duration,
          price,
          pkg.name_en ?? "",
          pkg.name_ar ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
    }
    const sorted = [...list];
    if (sortBy === "priceAsc")
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortBy === "priceDesc")
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sortBy === "durationAsc")
      sorted.sort(
        (a, b) => (a.duration_days ?? 0) - (b.duration_days ?? 0),
      );
    else if (sortBy === "durationDesc")
      sorted.sort(
        (a, b) => (b.duration_days ?? 0) - (a.duration_days ?? 0),
      );
    else if (sortBy === "nameAsc")
      sorted.sort((a, b) =>
        (locale === "ar" ? a.name_ar : a.name_en).localeCompare(
          locale === "ar" ? b.name_ar : b.name_en,
        ),
      );
    else if (sortBy === "nameDesc")
      sorted.sort((a, b) =>
        (locale === "ar" ? b.name_ar : b.name_en).localeCompare(
          locale === "ar" ? a.name_ar : a.name_en,
        ),
      );
    return sorted;
  }, [filteredPackages, searchQuery, sortBy, locale]);

  const getCategoryName = (c: PackageCategory) =>
    locale === "ar" ? `باقات ${c.name_ar}` : `Packages of ${c.name_en}`;
  const getLocationName = (l: Location) =>
    locale === "ar" ? l.name_ar : l.name_en;

  const goBack = () => {
    setView("categories");
    setSelectedCategoryId(null);
    setSelectedLocationId(null);
  };

  const showPackages =
    view === "category" ||
    (view === LOCATIONS_VIEW && selectedLocationId !== null);

  return (
    <>
      <PageHeader
        title={t("packages.title")}
        subtitle={t("packages.subtitle")}
      />

      {/* Full-page categories view (initial) */}
      {view === "categories" && (
        <section className="min-h-[calc(100vh-var(--header-height,64px)-180px)] flex flex-col py-8 sm:py-12">
          <div className="container mx-auto px-4 flex-1 flex flex-col">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6 flex-1 content-start max-w-6xl mx-auto justify-items-center w-full">
              <CategoryCard
                title={t("packages.discoverLocations")}
                imageUrl={locations[0]?.image_url ?? null}
                isSelected={false}
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedLocationId(null);
                  setView(LOCATIONS_VIEW);
                }}
                locale={locale}
                size="large"
              />
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  title={getCategoryName(cat)}
                  imageUrl={cat.image_url}
                  imageUrls={
                    cat.image_urls?.length ? cat.image_urls : undefined
                  }
                  isSelected={false}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedLocationId(null);
                    setView("category");
                  }}
                  locale={locale}
                  size="large"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full-page locations view (when Locations card clicked) */}
      {view === LOCATIONS_VIEW && (
        <section className="min-h-[calc(100vh-var(--header-height,64px)-180px)] flex flex-col py-8 sm:py-12 ">
          <div className="container mx-auto px-4 flex-1 flex flex-col">
            <Button
              variant="ghost"
              className={cn(
                "self-start mb-6 gap-2",
                locale === "ar" ? "flex-row-reverse" : "",
              )}
              onClick={goBack}
            >
              <ArrowLeft
                className={cn("w-4 h-4", locale === "ar" && "rotate-180")}
              />
              {t("packages.backToCategories")}
            </Button>
            {/* <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-8 text-center">
              {t('packages.selectLocation')}
            </h2> */}
            {locations.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                {locale === "ar"
                  ? "لا توجد مواقع متاحة"
                  : "No locations available"}
              </p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6 flex-1 content-start max-w-6xl mx-auto justify-items-center">
                {locations.map((loc) => (
                  <CategoryCard
                    key={loc.id}
                    title={getLocationName(loc)}
                    imageUrl={loc.image_url}
                    isSelected={selectedLocationId === loc.id}
                    onClick={() =>
                      setSelectedLocationId(
                        selectedLocationId === loc.id ? null : loc.id,
                      )
                    }
                    locale={locale}
                    size="large"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Packages list (shown when category selected, or when location selected in Locations view) */}
      {showPackages && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className={cn(
                "mb-4 gap-2",
                locale === "ar" ? "flex-row-reverse ms-auto" : "",
              )}
              onClick={goBack}
            >
              <ArrowLeft
                className={cn("w-4 h-4", locale === "ar" && "rotate-180")}
              />
              {t("packages.backToCategories")}
            </Button>
            {(selectedCategoryId || selectedLocationId) &&
              (() => {
                const cat = categories.find((c) => c.id === selectedCategoryId);
                const loc = locations.find((l) => l.id === selectedLocationId);
                const name = selectedCategoryId
                  ? cat
                    ? getCategoryName(cat)
                    : ""
                  : loc
                    ? getLocationName(loc)
                    : "";
                return name ? (
                  <p className="text-muted-foreground mb-6">
                    {t("packages.packagesIn")} {name}
                  </p>
                ) : null;
              })()}

            <SearchSortBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={t("packages.searchPlaceholder")}
              sortValue={sortBy}
              onSortChange={setSortBy}
              sortLabel={t("list.sortBy")}
              sortOptions={[
                { value: "priceAsc", label: t("list.sort.priceAsc") },
                { value: "priceDesc", label: t("list.sort.priceDesc") },
                { value: "durationAsc", label: t("list.sort.durationAsc") },
                { value: "durationDesc", label: t("list.sort.durationDesc") },
                { value: "nameAsc", label: t("list.sort.nameAsc") },
                { value: "nameDesc", label: t("list.sort.nameDesc") },
              ]}
              isRTL={locale === "ar"}
              className="mb-6"
            />

            {/* Packages Grid - consistent card heights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedPackages.map((pkg, index) => {
                const p = pkg as unknown as Record<string, unknown>;
                const name = getLocalizedContent(p, "name", locale);
                const description =
                  getLocalizedContent(p, "short_description", locale) ||
                  getLocalizedContent(p, "description", locale);
                const includes =
                  locale === "ar"
                    ? pkg.inclusions_ar?.length
                      ? pkg.inclusions_ar
                      : pkg.includes || []
                    : pkg.includes || [];

                return (
                  <article
                    key={pkg.id}
                    className={cn(
                      "group flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden",
                      "hover:border-primary/30 hover:shadow-xl transition-all duration-300",
                      "animate-fade-in-up",
                    )}
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  >
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="flex flex-col h-full"
                    >
                      <div className="flex flex-col md:flex-row md:min-h-[280px]">
                        {/* Image - fixed aspect & size */}
                        <div className="relative w-full md:w-64 h-48 md:h-auto md:min-h-[280px] shrink-0 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: pkg.images?.[0]
                                ? `url(${pkg.images[0]})`
                                : "url(/images/package-default.jpg)",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <Badge
                            className={cn(
                              "absolute top-3 left-3 text-white border-0",
                              pkg.package_type === "hajj"
                                ? "bg-primary"
                                : "bg-secondary text-secondary-foreground",
                            )}
                          >
                            {pkg.package_type === "hajj"
                              ? t("packages.hajj")
                              : t("packages.umrah")}
                          </Badge>
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-medium">
                            <Calendar className="w-4 h-4 shrink-0" />
                            {pkg.duration_days} {t("common.days")}
                          </div>
                        </div>

                        {/* Content - flex to fill, aligned */}
                        <div className="flex-1 flex flex-col p-6 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                            {name}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-shrink-0">
                            {description}
                          </p>

                          {includes.length > 0 && (
                            <div className="mb-4 flex-shrink-0">
                              <h4 className="text-xs font-medium text-foreground/80 mb-2">
                                {t("packages.includes")}
                              </h4>
                              <ul className="grid grid-cols-1 gap-1.5">
                                {includes.slice(0, 4).map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                  >
                                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span className="truncate">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Price & CTA - always at bottom */}
                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <span className="text-xs text-muted-foreground block">
                                {t("common.startingFrom")}
                              </span>
                              <span className="text-xl font-bold text-primary">
                                {pkg.currency} {pkg.price?.toLocaleString()}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 px-4 py-2 rounded-md text-sm font-medium",
                                "bg-primary text-primary-foreground",
                                "group-hover:bg-primary/90 transition-colors",
                              )}
                            >
                              {t("common.bookNow")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {displayedPackages.length === 0 && (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">
                  {locale === "ar"
                    ? "لا توجد باقات متاحة"
                    : "No packages available"}
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Button variant="outline" onClick={goBack}>
                    {t("packages.backToCategories")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
