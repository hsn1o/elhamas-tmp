'use client'

import Image from 'next/image'
import { PageHeader } from '@/components/page-header'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/lib/db'

const sections = [
  {
    key: 'vision' as const,
    titleKey: 'about.vision' as const,
    textKey: 'about.vision.text' as const,
    image: '/images/img1.jpg',
  },
  {
    key: 'objective' as const,
    titleKey: 'about.objective' as const,
    textKey: 'about.objective.text' as const,
    image: '/images/img2.jpg',
  },
  {
    key: 'message' as const,
    titleKey: 'about.message' as const,
    textKey: 'about.message.text' as const,
    image: '/images/img3.jpg',
  },
]

const stats = [
  { valueKey: 'about.stats.years' as const, label: '15+' },
  { valueKey: 'about.stats.pilgrims' as const, label: '10K+' },
  { valueKey: 'about.stats.hotels' as const, label: '50+' },
  { valueKey: 'about.stats.rating' as const, label: '4.9' },
]

interface AboutPageClientProps {
  testimonials: Testimonial[]
}

export function AboutPageClient({ testimonials }: AboutPageClientProps) {
  const { t, locale } = useI18n()
  const isRTL = locale === 'ar'

  return (
    <>
      <PageHeader
        title={t('about.title')}
        subtitle={t('about.subtitle')}
      />

      {/* Intro: video left, text right */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className={cn('w-full', isRTL && 'md:order-2')}>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]">
                <iframe
                  src="https://www.youtube.com/embed/x8GmQjKHhno"
                  title="About us"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
            <div className={cn('min-w-0', isRTL && 'md:order-1')}>
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.badge')}
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.companyName')}
              </h2>
              <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-[65ch]" dir={isRTL ? 'rtl' : 'ltr'}>
                <p>{t('about.intro1')}</p>
                <p>{t('about.intro2')}</p>
                <p>{t('about.intro3')}</p>
                <p>{t('about.intro4')}</p>
                <p>{t('about.intro5')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Objective, Message - alternating layout with accent bar */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          {sections.map((section, index) => {
            const textFirst = index % 2 === 0
            return (
              <div
                key={section.key}
                className={cn(
                  'grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-20',
                  index > 0 && 'border-t border-border',
                  !textFirst && 'md:grid-flow-dense'
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={cn('space-y-4', !textFirst && 'md:col-start-2')}>
                  <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
                    <div className="w-1.5 h-12 rounded-full bg-primary shrink-0" aria-hidden />
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t(section.titleKey)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-[55ch]" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t(section.textKey)}
                  </p>
                </div>
                <div className={cn('relative', textFirst ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1')}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]">
                    <Image
                      src={section.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-primary/10 pointer-events-none" aria-hidden />
                  <span className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-primary/5 pointer-events-none" aria-hidden />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={stat.valueKey} className="text-center" dir={isRTL ? 'rtl' : 'ltr'}>
                <p className="text-3xl md:text-4xl font-semibold text-primary mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{t(stat.valueKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
