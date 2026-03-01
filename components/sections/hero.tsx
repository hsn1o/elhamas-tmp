"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"

const serviceIcons = [
  { labelKey: "nav.events", icon: EventsIcon },
  { labelKey: "nav.hotels", icon: HotelsIcon },
  { labelKey: "nav.transportation", icon: TransportIcon },
  { labelKey: "hero.umrahPackage", icon: UmrahIcon },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-0 md:pt-24 min-w-0">
      {/* Background Image — slow zoom in/out (Ken Burns) */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/img5.jpg"
          alt="The Holy Kaaba in Makkah during pilgrimage"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-[#3a1518]/95" />
      </motion.div>

      {/* Centered content with backdrop panel for clarity */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-3 sm:px-4 md:px-6 text-center min-w-0 w-full">
        <motion.div
          className="w-full max-w-2xl rounded-xl sm:rounded-2xl border border-white/10 bg-[#4a1c20]/70 px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-14 shadow-2xl backdrop-blur-md"
          style={{ boxShadow: "0 25px 50px -12px rgba(74,28,32,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <motion.h1
            className="mb-4 sm:mb-5 text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white break-words"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              textShadow: "0 2px 12px rgba(74,28,32,0.8), 0 0 1px rgba(0,0,0,0.2)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-white/95 md:text-lg break-words"
            style={{ textShadow: "0 1px 6px rgba(74,28,32,0.6)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: easeOutExpo }}
          >
            <motion.a
              href="/"
              className="rounded-lg bg-primary px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lg md:px-8 md:py-3.5 md:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {t("hero.cta")}
            </motion.a>
            <motion.a
              href="/"
              className="rounded-lg border-2 border-white/90 bg-white/10 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm md:px-8 md:py-3.5 md:text-base"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {t("hero.secondary")}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom service icons row */}
      <motion.div
        className="relative z-10 mt-10 sm:mt-14 flex w-full max-w-3xl items-start justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-16 rounded-t-xl sm:rounded-t-2xl border-t border-white/10 bg-[#4a1c20]/80 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 backdrop-blur-sm min-w-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: easeOutExpo }}
      >
        {serviceIcons.map(({ labelKey, icon: Icon }, i) => (
          <motion.button
            key={labelKey}
            className="group flex flex-col items-center gap-2.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.4, delay: 0.75 + i * 0.06, ease: easeOutExpo }}
            whileHover={{ y: -4, transition: { duration: 0, delay: 0 } }}
            whileTap={{ scale: 0.97, transition: { duration: 0, delay: 0 } }}
          >
            <Icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white/85 transition-colors duration-300 group-hover:text-white" />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-white/80 transition-colors duration-300 group-hover:text-white md:text-xs">
              {t(labelKey)}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

/* ── SVG Icon Components ── */

function EventsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Kaaba-style building with arched door */}
      <rect x="10" y="14" width="28" height="24" rx="1" />
      <path d="M10 20h28" />
      <path d="M24 8l-14 6h28l-14-6z" />
      <path d="M21 38v-7a3 3 0 0 1 6 0v7" />
    </svg>
  )
}

function HotelsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Building with windows */}
      <rect x="8" y="8" width="32" height="32" rx="2" />
      <rect x="14" y="14" width="6" height="5" rx="0.5" />
      <rect x="28" y="14" width="6" height="5" rx="0.5" />
      <rect x="14" y="25" width="6" height="5" rx="0.5" />
      <rect x="28" y="25" width="6" height="5" rx="0.5" />
      <rect x="20" y="34" width="8" height="6" rx="1" />
    </svg>
  )
}

function TransportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Bus / van */}
      <rect x="6" y="14" width="36" height="18" rx="3" />
      <path d="M6 26h36" />
      <circle cx="14" cy="36" r="3" />
      <circle cx="34" cy="36" r="3" />
      <rect x="10" y="18" width="8" height="6" rx="1" />
      <rect x="20" y="18" width="8" height="6" rx="1" />
      <rect x="30" y="18" width="8" height="6" rx="1" />
    </svg>
  )
}

function UmrahIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Mosque with dome and minarets */}
      <path d="M24 10c-8 0-14 8-14 14v14h28V24c0-6-6-14-14-14z" />
      <path d="M24 6v4" />
      <path d="M20 38v-6a4 4 0 0 1 8 0v6" />
      <path d="M8 38h32" />
      <rect x="6" y="22" width="3" height="16" rx="1" />
      <rect x="39" y="22" width="3" height="16" rx="1" />
      <circle cx="7.5" cy="20" r="1.5" />
      <circle cx="40.5" cy="20" r="1.5" />
    </svg>
  )
}
