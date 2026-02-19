'use client'

import { useI18n } from '@/lib/i18n'

const partnerNames = ['Oman Air', 'Air Arabia', 'Qatar Airways', 'Saudia', 'Sky Team']

export function PartnersSection() {
  const { locale } = useI18n()

  return (
    <section className="py-10 sm:py-12 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
          {partnerNames.map((name, i) => (
            <div
              key={i}
              className="text-lg font-semibold text-muted-foreground grayscale hover:grayscale-0 hover:text-foreground transition-all duration-300"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
