'use client'

import Link from 'next/link'
import { Hotel, Plane, FileCheck, Map, Shield, Headphones } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const features = [
  { icon: Hotel, key: 'feature.luxuryHotel', descKey: 'feature.luxuryHotel.desc' },
  { icon: Plane, key: 'feature.vipPlanes', descKey: 'feature.vipPlanes.desc' },
  { icon: FileCheck, key: 'feature.easyVisa', descKey: 'feature.easyVisa.desc' },
  { icon: Map, key: 'feature.roadmapGuide', descKey: 'feature.roadmapGuide.desc' },
  { icon: Shield, key: 'feature.avoidHassle', descKey: 'feature.avoidHassle.desc' },
  { icon: Headphones, key: 'feature.support24', descKey: 'feature.support24.desc' },
]

export function FeaturesSection() {
  const { t, locale, isRTL } = useI18n()

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left – image card */}
          <Link
            href="/packages"
            className={cn(
              'group block rounded-lg overflow-hidden bg-charcoal text-white p-6 sm:p-8',
              isRTL && 'lg:order-2'
            )}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              {locale === 'ar' ? 'جولة المدينة 40 صلاة حج' : 'MADINAH 40 PRAYERS TOUR HAJJ'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-white/10 bg-cover bg-center"
                  style={{
                    backgroundImage: i === 1 ? `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80')` : undefined,
                  }}
                />
              ))}
            </div>
          </Link>

          {/* Right – heading + 6 features */}
          <div className={isRTL ? 'lg:order-1' : ''}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">
              {locale === 'ar' ? 'نحن وكالة حج وعمرة حائزة على جوائز' : 'We are award winning Hajj & Umrah Agency'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-lg">
              {locale === 'ar'
                ? 'نقدم خدمات حج وعمرة متميزة مع إقامة فاخرة ومرشدين متخصصين وراحة كاملة لرحلتك المباركة.'
                : 'We deliver exceptional Hajj & Umrah experiences with luxury stays, expert guides, and full support for your blessed journey.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{t(f.key)}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{t(f.descKey)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
