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
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20 pb-0 md:pt-24">
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
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.div
          className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#4a1c20]/70 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-12 sm:py-14 md:px-14"
          style={{ boxShadow: "0 25px 50px -12px rgba(74,28,32,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <motion.h1
            className="mb-5 text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[2.7rem]"
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
            className="mx-auto max-w-lg text-base leading-relaxed text-white/95 md:text-lg"
            style={{ textShadow: "0 1px 6px rgba(74,28,32,0.6)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: easeOutExpo }}
          >
            <motion.a
              href="/"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg md:px-8 md:py-3.5 md:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {t("hero.cta")}
            </motion.a>
            <motion.a
              href="/"
              className="rounded-lg border-2 border-white/90 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm md:px-8 md:py-3.5 md:text-base"
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
        className="relative z-10 mt-14 flex w-full max-w-3xl items-start justify-center gap-10 rounded-t-2xl border-t border-white/10 bg-[#4a1c20]/80 px-8 py-6 backdrop-blur-sm md:mt-16 md:gap-16 md:py-8"
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
            <Icon className="h-8 w-8 text-white/85 transition-colors duration-300 group-hover:text-white md:h-10 md:w-10" />
            <span className="text-[11px] font-medium tracking-wide text-white/80 transition-colors duration-300 group-hover:text-white md:text-xs">
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
