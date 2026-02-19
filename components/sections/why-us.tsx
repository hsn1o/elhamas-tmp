'use client'

import { Award, DollarSign, MessageCircle, Shield } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const benefits = [
  { icon: Award, key: 'why.competent', descKey: 'why.competent.desc', featured: false },
  { icon: DollarSign, key: 'why.affordable', descKey: 'why.affordable.desc', featured: false },
  { icon: MessageCircle, key: 'why.responsive', descKey: 'why.responsive.desc', featured: false },
  { icon: Shield, key: 'why.trust', descKey: 'why.trust.desc', featured: true },
]

export function WhyUsSection() {
  const { t, locale } = useI18n()

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {locale === 'ar' ? 'لماذا نحن؟' : 'Why Us?'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.key}
                className={cn(
                  'rounded-lg p-6 border transition-all duration-300',
                  b.featured
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-card border-border text-foreground'
                )}
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-4', b.featured ? 'bg-primary/20' : 'bg-primary/10')}>
                  <Icon className={cn('w-5 h-5', b.featured ? 'text-primary' : 'text-primary')} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t(b.key)}</h3>
                <p className={cn('text-sm', b.featured ? 'text-white/80' : 'text-muted-foreground')}>
                  {t(b.descKey)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
