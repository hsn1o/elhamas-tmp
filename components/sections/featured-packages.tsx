"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n, getLocalizedContent } from "@/lib/i18n";
import type { TourPackage } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const PACKAGE_COLOR = "#4a1c20";

// Default display data for Makkah & Madinah when no matching packages from DB
const MAKKAH_IMAGE =
  "/images/img1.jpg";
const MADINAH_IMAGE =
  "/images/img2.jpg";

function isMakkahPackage(pkg: TourPackage): boolean {
  const name = `${(pkg.name_en || "").toLowerCase()} ${pkg.name_ar || ""}`;
  return (
    name.includes("makkah") || name.includes("مكة") || name.includes("مكّة")
  );
}

function isMadinahPackage(pkg: TourPackage): boolean {
  const name = `${(pkg.name_en || "").toLowerCase()} ${pkg.name_ar || ""}`;
  return (
    name.includes("madinah") ||
    name.includes("medina") ||
    name.includes("المدينة") ||
    name.includes("مدينة")
  );
}

interface FeaturedPackagesProps {
  packages: TourPackage[];
}

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function FeaturedPackagesSection({ packages }: FeaturedPackagesProps) {
  const { t, locale, isRTL } = useI18n();
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.08);

  const makkahPkg = packages.find(isMakkahPackage) ?? packages[0];
  const madinahPkg =
    packages.find(isMadinahPackage) ?? packages[1] ?? packages[0];

  const items: { pkg: TourPackage; image: string; cityKey: string }[] = [];
  if (makkahPkg) {
    items.push({
      pkg: makkahPkg,
      image: makkahPkg.images?.[0] || MAKKAH_IMAGE,
      cityKey: locale === "ar" ? "مكة المكرمة" : "Makkah",
    });
  }
  if (madinahPkg && madinahPkg.id !== makkahPkg?.id) {
    items.push({
      pkg: madinahPkg,
      image: madinahPkg.images?.[0] || MADINAH_IMAGE,
      cityKey: locale === "ar" ? "المدينة المنورة" : "Madinah",
    });
  }

  type PackageDisplay = { pkg: TourPackage; image: string; cityKey: string };

  const staticMakkah: PackageDisplay = {
    pkg: {
      id: "makkah",
      name_en: "Makkah Package - 4 Nights",
      name_ar: "باقة مكة - أربع ليال",
      description_en: null,
      description_ar: null,
      package_type: null,
      duration_days: 4,
      price: 4625,
      currency: locale === "ar" ? "ر.س" : "SAR",
      includes: [],
      itinerary: [],
      images: [],
      featured: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    image: MAKKAH_IMAGE,
    cityKey: locale === "ar" ? "مكة المكرمة" : "Makkah",
  };
  const staticMadinah: PackageDisplay = {
    pkg: {
      id: "madinah",
      name_en: "Madinah Package - 4 Nights",
      name_ar: "باقة المدينة - أربع ليال",
      description_en: null,
      description_ar: null,
      package_type: null,
      duration_days: 4,
      price: 3870,
      currency: locale === "ar" ? "ر.س" : "SAR",
      includes: [],
      itinerary: [],
      images: [],
      featured: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    image: MADINAH_IMAGE,
    cityKey: locale === "ar" ? "المدينة المنورة" : "Madinah",
  };

  const displayItems: PackageDisplay[] =
    items.length >= 2 ? items : [staticMakkah, staticMadinah];

  return (
    <section
      ref={sectionRef}
      id="packages"
      className={cn(
        "relative overflow-hidden py-16 md:py-24 scroll-mt-[4.5rem]",
        "min-h-[480px] flex flex-col",
      )}
    >
      <div
        className={cn(
          "absolute -top-2 bottom-0 w-[55%] md:w-[50%]",
          isRTL ? "right-0" : "left-0",
        )}
        style={{
          background: PACKAGE_COLOR,
          clipPath: isRTL
            ? "polygon(0 0, 100% 0, 100% 100%, 0 85%)"
            : "polygon(100% 0, 100% 100%, 0 85%, 0 0)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 flex flex-col-reverse lg:flex-row flex-1 gap-8 lg:gap-12 items-stretch">
        {/* Left: title block */}
        <motion.div
          className={cn(
            "flex flex-col justify-center items-start lg:min-w-[320px] order-2 lg:order-1",
            isRTL
              ? "lg:items-start lg:text-left"
              : "lg:items-end lg:text-right",
          )}
          initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <p className="text-white/90 text-sm font-medium mb-2">
            {t("home.featuredPackages.exploreWithUs")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {t("home.featuredPackages")}
          </h2>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              variant="outline"
              className="rounded-lg bg-white/15 text-white border-white/30 hover:bg-white/25 hover:text-white transition-colors duration-200"
            >
              <Link href="/">{t("home.featuredPackages.allTrips")}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: cards */}
        <div className="flex-1 flex items-center order-1 lg:order-2">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
            {displayItems.slice(0, 2).map(({ pkg, image, cityKey }, index) => {
              const name = getLocalizedContent(pkg as unknown as Record<string, unknown>, "name", locale);
              const duration = pkg.duration_days ?? 4;
              const price = pkg.price ?? 0;
              const currency =
                pkg.currency ?? (locale === "ar" ? "ر.س" : "SAR");
              const href =
                pkg.id && pkg.id !== "makkah" && pkg.id !== "madinah"
                  ? `/packages/${pkg.id}`
                  : "/packages";

              return (
                <motion.div
                  key={pkg.id}
                  className="group rounded-2xl overflow-hidden bg-white shadow-lg border border-[#4a1c20]/10 flex flex-col"
                  initial={{ opacity: 0, y: 24 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.1,
                    ease: easeOutExpo,
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div
                    className="p-5 flex flex-col flex-1 transition-shadow duration-300 group-hover:shadow-xl"
                    style={{ color: PACKAGE_COLOR }}
                  >
                    <h3 className="text-lg font-bold mb-3 line-clamp-2">
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <MapPin
                        className="w-4 h-4 shrink-0"
                        style={{ color: PACKAGE_COLOR }}
                      />
                      <span>{cityKey}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <Calendar
                        className="w-4 h-4 shrink-0"
                        style={{ color: PACKAGE_COLOR }}
                      />
                      <span>
                        {duration} {t("common.days")}
                      </span>
                    </div>
                    <div className="mt-auto pt-2 border-t border-[#4a1c20]/15">
                      <p className="text-xs opacity-90">
                        {t("common.startingFrom")}
                      </p>
                      <p className="text-xl font-bold">
                        {price.toLocaleString()} {currency}
                      </p>
                      <p className="text-xs opacity-90">
                        {t("common.perPerson")}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-4 rounded-lg font-medium text-white hover:opacity-90 w-full transition-opacity duration-200"
                        style={{ backgroundColor: PACKAGE_COLOR }}
                      >
                        <Link href="/">{t("common.bookNow")}</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
