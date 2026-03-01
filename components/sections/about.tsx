"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useI18n } from "@/lib/i18n"
import { Target, Eye, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const ACCENT = "#4a1c20"
const easeOutExpo = [0.16, 1, 0.3, 1] as const

// const stats = [
//   { value: "15+", labelKey: "about.stats.years" as const },
//   { value: "50K+", labelKey: "about.stats.pilgrims" as const },
//   { value: "100+", labelKey: "about.stats.hotels" as const },
//   { value: "4.9", labelKey: "about.stats.rating" as const },
// ]

const cardKeys = [
  { key: "about.vision" as const, textKey: "about.vision.text" as const, icon: Eye },
  { key: "about.objective" as const, textKey: "about.objective.text" as const, icon: Target },
  { key: "about.message" as const, textKey: "about.message.text" as const, icon: MessageCircle },
]

export function AboutSection() {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.1)
  const { t, isRTL } = useI18n()

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-28 overflow-x-hidden" id="about">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 min-w-0">
        <div className="grid items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl min-w-0">
              <iframe
                src="https://www.youtube.com/embed/x8GmQjKHhno"
                title="Elhamas Group Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            {/* Floating stats card */}
            {/* <motion.div
              className="absolute -bottom-6 -right-4 rounded-xl bg-background p-6 shadow-2xl sm:-right-8"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
              whileHover={{ y: -2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.labelKey} className="text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{t(stat.labelKey)}</p>
                  </div>
                ))}
              </div>
            </motion.div> */}
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          >
            <span className="mb-2 inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("about.badge")}</span>
            <h2 className="mb-4 sm:mb-6 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground break-words">
              {t("about.companyName")}
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed text-muted-foreground text-justify break-words">
              {t("about.intro1")} {t("about.intro2")} {t("about.intro3")} {t("about.intro4")} {t("about.intro5")}
            </p>

            {/* Vision, Mission, Objectives cards */}
            <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
              {cardKeys.map(({ key, textKey, icon: Icon }, index) => (
                <motion.div
                  key={key}
                  className="rounded-lg sm:rounded-xl border border-border/60 bg-card p-3 sm:p-4 shadow-sm min-w-0"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.45,
                    delay: 0.2 + index * 0.08,
                    ease: easeOutExpo,
                  }}
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)" }}
                >
                  <div
                    className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <h3
                    className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold break-words"
                    style={{ color: ACCENT }}
                  >
                    {t(key)}
                  </h3>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-muted-foreground line-clamp-4 break-words">
                    {t(textKey)}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="inline-flex rounded-lg bg-primary px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("about.learnMore")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
