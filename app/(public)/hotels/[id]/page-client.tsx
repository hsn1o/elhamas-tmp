"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Star,
  Check,
  Bed,
  Wifi,
  Snowflake,
  Tv,
  Refrigerator,
  User,
  Ruler,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useI18n, getLocalizedContent, type Locale } from "@/lib/i18n";
import type { Hotel, Room } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HotelDetailClientProps {
  hotel: Hotel;
}

export function HotelDetailClient({ hotel }: HotelDetailClientProps) {
  const { t, locale } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = hotel.images?.length
    ? hotel.images
    : ["/images/package-default.jpg"];

  const goToSlide = (index: number) => {
    setSelectedIndex(((index % images.length) + images.length) % images.length);
  };

  const name = getLocalizedContent(
    hotel as unknown as Record<string, unknown>,
    "name",
    locale,
  );
  const description = getLocalizedContent(
    hotel as unknown as Record<string, unknown>,
    "description",
    locale,
  );
  const rooms = hotel.rooms ?? [];
  const sectionCard = "rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8";

  const roomCount = rooms.length;

  return (
    <>
      {/* Hero: hotel name + stars only */}
      <section className="relative min-h-[260px] sm:min-h-[300px] md:min-h-[360px] lg:min-h-[380px] flex flex-col justify-center overflow-hidden pt-20 sm:pt-24">
        <Image
          src={images[0]}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-primary/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-4xl min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg break-words">
            {name}
          </h1>
          <div
            className="flex items-center justify-center gap-1"
            aria-label={`${hotel.star_rating} ${t("hotels.starRating")}`}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn(
                  "w-6 h-6 md:w-7 md:h-7",
                  n <= hotel.star_rating
                    ? "fill-white text-white"
                    : "fill-white/30 text-white/30",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Info bar on the line between hero and content – full width, in white space */}
      <div className="relative z-20 -mt-4 sm:-mt-6 px-3 sm:px-4 md:px-6">
        <div className="mx-auto max-w-6xl min-w-0">
          <div className="rounded-xl sm:rounded-2xl bg-white border border-border shadow-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap items-center justify-center md:justify-between gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            {(locale === "ar" ? hotel.city_ar || hotel.city : hotel.city) && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <span className="text-lg leading-none" aria-hidden>
                  📍
                </span>
                {locale === "ar" ? hotel.city_ar || hotel.city : hotel.city}
              </span>
            )}
            {hotel.distance_to_haram && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Ruler className="w-4 h-4 text-primary shrink-0" />
                {t("hotels.distanceToHaram")}: {hotel.distance_to_haram}
              </span>
            )}
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Bed className="w-4 h-4 text-primary shrink-0" />
              {roomCount} {t("hotels.rooms")}
            </span>
          </div>
        </div>
      </div>

      <section className="py-8 sm:py-12 md:py-16 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl min-w-0">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 shrink-0",
                locale === "ar" && "rotate-180",
              )}
            />
            {locale === "ar" ? "العودة للفنادق" : "Back to Hotels"}
          </Link>

          <div className="space-y-8">
            {/* Hero image carousel + hotel info */}
            <div className={cn(sectionCard, "overflow-hidden p-0")}>
              <div className="relative w-full min-w-0">
                <div className="relative w-full aspect-[21/14] min-h-[180px] sm:min-h-[200px] bg-muted overflow-hidden rounded-2xl sm:rounded-3xl">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-300",
                        selectedIndex === i
                          ? "opacity-100 z-0"
                          : "opacity-0 z-[-1] pointer-events-none",
                      )}
                    >
                      <Image
                        src={src}
                        alt={`${name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 896px"
                        priority={i <= 1}
                      />
                    </div>
                  ))}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToSlide(selectedIndex - 1)}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(selectedIndex + 1)}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
                    </button>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 rounded-md bg-black/50 px-3 py-1.5 text-white text-sm font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      {hotel.star_rating} {t("hotels.starRating")}
                    </span>
                    {hotel.price_per_night != null && (
                      <span className="text-white/90 text-sm font-medium">
                        {locale === "ar" ? "ابتداءً من" : "From"}{" "}
                        {hotel.currency}{" "}
                        {hotel.price_per_night.toLocaleString()} /{" "}
                        {t("common.perNight")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {images.length > 1 && (
                <div className="p-3 sm:p-4 border-t border-border flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => goToSlide(i)}
                      onKeyDown={(e) => e.key === "Enter" && goToSlide(i)}
                      className={cn(
                        "relative shrink-0 w-12 h-9 sm:w-16 sm:h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer",
                        selectedIndex === i
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className={sectionCard}>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {locale === "ar" ? "الوصف" : "Description"}
                </h2>
                <div
                  className="text-muted-foreground space-y-4"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-semibold text-foreground mt-6 mb-2 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-foreground mt-5 mb-2">
                          {children}
                        </h2>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="marker:text-primary">{children}</li>
                      ),
                    }}
                  >
                    {description}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Hotel amenities */}
            {(() => {
              const en = hotel.amenities ?? [];
              const ar = hotel.amenities_ar ?? [];
              const list = en
                .map((_, i) => (locale === "ar" && ar[i] ? ar[i] : en[i]))
                .filter(Boolean);
              return list.length > 0 ? (
                <div className={sectionCard}>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {t("hotels.amenities")}
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {list.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm text-foreground"
                      >
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            {/* Rooms */}
            {rooms.length > 0 && (
              <div className={sectionCard}>
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {t("hotels.rooms")}
                </h2>
                <div className="space-y-8">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      locale={locale}
                      t={t}
                      hotelId={hotel.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div
              className={cn(
                sectionCard,
                "flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6",
                "bg-primary/5 border-primary/20",
              )}
            >
              <div className="text-center sm:text-left min-w-0">
                <p className="text-lg sm:text-xl font-bold text-foreground break-words">{name}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {hotel.star_rating} {t("hotels.starRating")}
                  {hotel.price_per_night != null && (
                    <>
                      {" "}
                      • {hotel.currency}{" "}
                      {hotel.price_per_night.toLocaleString()}{" "}
                      {t("common.perNight")}
                    </>
                  )}
                </p>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] shrink-0">
                <Link href={`/contact?hotel=${hotel.id}`}>
                  {t("common.bookNow")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function amenityIcon(amenity: string) {
  const a = amenity.toLowerCase();
  if (a.includes("wifi") || a.includes("wi-fi")) return Wifi;
  if (a.includes("air") || a.includes("ac") || a.includes("conditioning"))
    return Snowflake;
  if (a.includes("tv") || a.includes("television")) return Tv;
  if (
    a.includes("fridge") ||
    a.includes("minibar") ||
    a.includes("refrigerator")
  )
    return Refrigerator;
  if (a.includes("bed") || a.includes("beds")) return Bed;
  return Check;
}

function RoomCard({
  room,
  locale,
  t,
  hotelId,
}: {
  room: Room;
  locale: Locale;
  t: (key: string) => string;
  hotelId: string;
}) {
  const name = getLocalizedContent(
    room as unknown as Record<string, unknown>,
    "name",
    locale,
  );
  const description = getLocalizedContent(
    room as unknown as Record<string, unknown>,
    "description",
    locale,
  );
  const imageUrl = room.image_url || null;
  const amenitiesEn = room.amenities ?? [];
  const amenitiesAr = room.amenities_ar ?? [];
  const amenities = amenitiesEn
    .map((_, i) =>
      locale === "ar" && amenitiesAr[i] ? amenitiesAr[i] : amenitiesEn[i],
    )
    .filter(Boolean);
  const fitsLabel =
    room.max_guests === 1
      ? t("hotels.fitsPerson")
      : locale === "ar"
        ? `لـ ${room.max_guests} أشخاص`
        : `Fits ${room.max_guests} persons`;

  return (
    <article className="rounded-xl border border-border overflow-hidden bg-card min-w-0">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-border">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground break-words">{name}</h3>
        {description ? (
          <p
            className="text-sm text-muted-foreground mt-2 line-clamp-3"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div className={cn("flex flex-col md:flex-row min-w-0")}>
        {/* Left: room image only */}
        <div className={cn("flex flex-col md:w-[260px] lg:w-[280px] shrink-0")}>
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[200px] lg:h-[220px] bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  background:
                    "linear-gradient(135deg, #751f27 0%, #4a1c20 100%)",
                }}
              />
            )}
          </div>
        </div>

        {/* Middle: Amenities + Guests */}
        <div className="flex-1 p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border min-w-0">
          {amenities.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t("hotels.amenities")}
              </h3>
              <ul className="space-y-2" dir={locale === "ar" ? "rtl" : "ltr"}>
                {amenities.map((a, i) => {
                  const Icon = amenityIcon(a);
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span>{a}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {t("hotels.guests")}
            </h3>
            <p className="flex items-center gap-2 text-sm text-foreground">
              <User className="w-4 h-4 text-primary shrink-0" />
              {fitsLabel}
            </p>
          </div>
        </div>

        {/* Right: Stay (price) + disclaimer + Book now */}
        <div
          className={cn(
            "p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border",
            "bg-muted/30 min-w-0",
            locale === "ar" && "md:border-l-0 md:border-r md:border-r-border",
          )}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {t("hotels.stay")}
            </h3>
            <p className="text-lg font-bold text-foreground">
              {room.currency} {room.price_per_night.toLocaleString()}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {t("common.perNight")}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-[240px] break-words">
              {t("hotels.priceDisclaimer")}
            </p>
          </div>
          <Button
            asChild
            className="w-full sm:w-auto mt-auto bg-primary hover:bg-primary/90 shrink-0"
          >
            <Link href={`/hotels/${hotelId}/rooms/${room.id}`}>
              {t("common.bookNow")} →
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
