'use client'

import Link from 'next/link'
import { FileCheck, Hotel, Car } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const ACCENT = '#4a1c20'
const easeOutExpo = [0.16, 1, 0.3, 1] as const

const services = [
  { icon: FileCheck, titleKey: 'services.visas.title' as const, descKey: 'services.visas.desc' as const, href: '/visas' },
  { icon: Hotel, titleKey: 'services.hotels.title' as const, descKey: 'services.hotels.desc' as const, href: '/hotels' },
  { icon: Car, titleKey: 'services.transportation.title' as const, descKey: 'services.transportation.desc' as const, href: '/transportation' },
]

export function ServicesListSection() {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.08)
  const { t, isRTL } = useI18n()

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: easeOutExpo,
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <Link
                  href={service.href}
                  className={cn(
                    'group block rounded-2xl border border-border bg-card p-6 sm:p-8 h-full transition-all duration-300',
                    'hover:shadow-xl hover:border-primary/20 hover:ring-2 hover:ring-primary/10'
                  )}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: ACCENT }}
                  >
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-3">
                    {t(service.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    {t('common.readMore')}
                    <span className={cn('inline-block', isRTL && 'rotate-180')}>→</span>
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
