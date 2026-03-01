"use client"

import Image from "next/image"
import {
  Hotel,
  Plane,
  FileCheck,
  Map,
  Shield,
  Headphones,
} from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const YOUTUBE_VIDEO_ID = "xkUj3DfBDUY"

const services = [
  {
    icon: FileCheck,
    key: "feature.easyVisa",
    descKey: "feature.easyVisa.desc",
    image: "images/visa.png",
  },
  {
    icon: Hotel,
    key: "feature.luxuryHotel",
    descKey: "feature.luxuryHotel.desc",
    image: "images/hotel.jpeg",
  },
  {
    icon: Plane,
    key: "feature.vipPlanes",
    descKey: "feature.vipPlanes.desc",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    icon: Map,
    key: "feature.roadmapGuide",
    descKey: "feature.roadmapGuide.desc",
    image: "images/tourism.jpg",
  },
]

export function DestinationsSection() {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.08)
  const { t, locale, isRTL } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Build YouTube embed URL with all required parameters
  // Video plays from 0:38 (38 seconds) to 1:28 (88 seconds)
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0&hd=1&vq=hd1080&enablejsapi=1&start=38&end=88&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`

  return (
    <>
      {/* Full-viewport hero video - appears above all other content */}
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={youtubeEmbedUrl}
            title="Hero Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            className="absolute top-1/2 left-1/2"
            style={{
              pointerEvents: 'none',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.77777778vh',
              transform: 'translate(-50%, -50%)',
              border: 'none',
            }}
            frameBorder="0"
          />
          {/* Overlay gradient for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2d0f12]/90 z-10 pointer-events-none" />
        </div>
      </div>

      {/* Main content section */}
      <section
        ref={sectionRef}
        id="destinations"
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d0f12] via-[#3a1518] to-[#4a1c20]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.15),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
            {locale === "ar" ? "استكشف خدماتنا" : "Our Services"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
            {locale === "ar"
              ? "كل ما تحتاجه لرحلة عمرة مريحة... ضمن حزمة واحدة"
              : "We deliver exceptional Hajj & Umrah experiences with luxury stays, expert guides, and full support for your blessed journey."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-6 sm:px-10 md:px-14 lg:px-20 min-w-0"
        >
          <Carousel
            key={isRTL ? "rtl" : "ltr"}
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
              direction: isRTL ? "rtl" : "ltr",
            }}
            className="w-full"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <CarouselItem
                    key={service.key}
                    className="pl-3 sm:pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      className="group relative overflow-hidden rounded-xl sm:rounded-2xl ring-2 ring-white/10 min-w-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + index * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={service.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#4a1c20]/95 via-[#4a1c20]/50 to-[#4a1c20]/0" />
                      </div>
                      <div className="relative flex flex-col justify-end p-4 sm:p-6 min-h-[260px] sm:min-h-[280px] md:min-h-[320px]">
                        <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white break-words">
                          {t(service.key)}
                        </h3>
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-white/90 line-clamp-3 break-words">
                          {t(service.descKey)}
                        </p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                "left-0 border-white/20 bg-[#4a1c20]/90 text-white hover:bg-[#4a1c20] hover:text-white disabled:opacity-40",
                isRTL && "left-auto right-0 [&>svg]:scale-x-[-1]"
              )}
            />
            <CarouselNext
              className={cn(
                "right-0 border-white/20 bg-[#4a1c20]/90 text-white hover:bg-[#4a1c20] hover:text-white disabled:opacity-40",
                isRTL && "right-auto left-0 [&>svg]:scale-x-[-1]"
              )}
            />
          </Carousel>

          {/* Dots — one per snap point (page) */}
          {count > 0 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: count }, (_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`${locale === "ar" ? "الصفحة" : "Page"} ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full",
                    current === i + 1 ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                  )}
                  animate={{
                    width: current === i + 1 ? 24 : 8,
                    opacity: current === i + 1 ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </section>
    </>
  )
}
