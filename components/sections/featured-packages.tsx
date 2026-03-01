"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n, getLocalizedContent } from "@/lib/i18n";
import type { TourPackage } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const PACKAGE_COLOR = "#4a1c20";
const DEFAULT_IMAGE = "/images/img1.jpg";
const SM_BREAKPOINT = 640;

interface FeaturedPackagesProps {
  packages: TourPackage[];
}

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function FeaturedPackagesSection({ packages }: FeaturedPackagesProps) {
  const { t, locale, isRTL } = useI18n();
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.08);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(2);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${SM_BREAKPOINT}px)`);
    const update = () => setCardsPerPage(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const featuredPackages = useMemo(
    () =>
      packages.filter(
        (p) => p.featured && p.is_active
      ),
    [packages]
  );

  const totalSlides = Math.max(1, Math.ceil(featuredPackages.length / cardsPerPage));
  const currentPair = useMemo(
    () =>
      featuredPackages.slice(currentSlide * cardsPerPage, currentSlide * cardsPerPage + cardsPerPage),
    [featuredPackages, currentSlide, cardsPerPage]
  );

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, Math.max(0, totalSlides - 1)));
  }, [totalSlides]);

  const goPrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  return (
    <section
      ref={sectionRef}
      id="packages"
      className={cn(
        "relative overflow-hidden py-10 sm:py-14 md:py-16 lg:py-24 scroll-mt-[4.5rem] overflow-x-hidden",
        "min-h-[400px] sm:min-h-[480px] flex flex-col"
      )}
    >
      <div
        className={cn(
          "absolute -top-2 bottom-0 w-[55%] md:w-[50%]",
          isRTL ? "right-0" : "left-0"
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
            "flex flex-col justify-center items-start lg:min-w-[280px] xl:min-w-[320px] order-2 lg:order-1 min-w-0",
            isRTL
              ? "lg:items-start lg:text-left"
              : "lg:items-end lg:text-right"
          )}
          initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <p className="text-white/90 text-xs sm:text-sm font-medium mb-2">
            {t("home.featuredPackages.exploreWithUs")}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight break-words">
            {t("home.featuredPackages")}
          </h2>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              variant="outline"
              className="rounded-lg bg-white/15 text-white border-white/30 hover:bg-white/25 hover:text-white transition-colors duration-200"
            >
              <Link href="/packages">{t("home.featuredPackages.allTrips")}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: cards with navigation */}
        <div className="flex-1 flex items-center order-1 lg:order-2">
          <div className="w-full relative flex items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto min-w-0">
            {/* Left arrow */}
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label={locale === "ar" ? "السابق" : "Previous"}
              className={cn(
                "shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                "bg-white/90 text-[#4a1c20] hover:bg-white shadow-lg",
                !canGoPrev && "opacity-40 cursor-not-allowed hover:bg-white/90"
              )}
            >
              <ChevronLeft
                className={cn("w-5 h-5 sm:w-6 sm:h-6", isRTL && "rotate-180")}
              />
            </button>

            {/* Cards grid */}
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {currentPair.length === 0 ? (
                <p className="text-white/80 col-span-2 text-center py-8 sm:py-12 text-sm">
                  {locale === "ar"
                    ? "لا توجد باقات مميزة متاحة حالياً"
                    : "No featured packages available at the moment"}
                </p>
              ) : (
                <AnimatePresence mode="wait">
                  {currentPair.map((pkg, index) => {
                    const name = getLocalizedContent(
                      pkg as unknown as Record<string, unknown>,
                      "name",
                      locale
                    );
                    const location = getLocalizedContent(
                      pkg as unknown as Record<string, unknown>,
                      "location",
                      locale
                    );
                    const image =
                      pkg.images?.[0] || pkg.location_image_url || DEFAULT_IMAGE;
                    const duration = pkg.duration_days ?? 4;
                    const price = pkg.price ?? 0;
                    const currency =
                      pkg.currency ?? (locale === "ar" ? "ر.س" : "SAR");

                    return (
                      <motion.div
                        key={`${pkg.id}-${currentSlide}`}
                        className="group rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-lg border border-[#4a1c20]/10 flex flex-col min-w-0"
                        initial={{ opacity: 0, y: 24 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1,
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
                          className="p-4 sm:p-5 flex flex-col flex-1 transition-shadow duration-300 group-hover:shadow-xl min-w-0"
                          style={{ color: PACKAGE_COLOR }}
                        >
                          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 line-clamp-2 break-words">
                            {name}
                          </h3>
                          {location && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-1 min-w-0">
                              <MapPin
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                                style={{ color: PACKAGE_COLOR }}
                              />
                              <span className="truncate">{location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4">
                            <Calendar
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
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
                            <p className="text-lg sm:text-xl font-bold break-words">
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
                              <Link href={`/packages/${pkg.id}`}>
                                {t("common.bookNow")}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Right arrow */}
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label={locale === "ar" ? "التالي" : "Next"}
              className={cn(
                "shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                "bg-white/90 text-[#4a1c20] hover:bg-white shadow-lg",
                !canGoNext && "opacity-40 cursor-not-allowed hover:bg-white/90"
              )}
            >
              <ChevronRight
                className={cn("w-5 h-5 sm:w-6 sm:h-6", isRTL && "rotate-180")}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
