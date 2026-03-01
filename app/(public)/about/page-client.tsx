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
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-6xl min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-start">
            <div className={cn('w-full min-w-0', isRTL && 'md:order-2')}>
              <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-muted shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]">
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
              <p className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.badge')}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-6 sm:mb-8 break-words" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.companyName')}
              </h2>
              <div className="space-y-4 sm:space-y-6 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-[65ch]" dir={isRTL ? 'rtl' : 'ltr'}>
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
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-muted/30 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-5xl min-w-0">
          {sections.map((section, index) => {
            const textFirst = index % 2 === 0
            return (
              <div
                key={section.key}
                className={cn(
                  'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-center py-10 sm:py-14 md:py-16 lg:py-20',
                  index > 0 && 'border-t border-border',
                  !textFirst && 'md:grid-flow-dense'
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={cn('space-y-3 sm:space-y-4 min-w-0', !textFirst && 'md:col-start-2')}>
                  <div className={cn('flex items-center gap-2 sm:gap-3', isRTL && 'flex-row-reverse')}>
                    <div className="w-1.5 h-10 sm:h-12 rounded-full bg-primary shrink-0" aria-hidden />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground break-words" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t(section.titleKey)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-[55ch] break-words" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t(section.textKey)}
                  </p>
                </div>
                <div className={cn('relative min-w-0', textFirst ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1')}>
                  <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]">
                    <Image
                      src={section.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 pointer-events-none" aria-hidden />
                  <span className="absolute -bottom-1.5 -left-1.5 sm:-bottom-2 sm:-left-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 pointer-events-none" aria-hidden />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Reems & Dreems - under message */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 border-t border-border overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl min-w-0">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-center">
            <div className={cn('shrink-0', isRTL && 'md:order-2')}>
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80">
                <Image
                  src="/images/reems.png"
                  alt={t('about.reems.title')}
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="(max-width: 768px) 256px, 320px"
                />
              </div>
            </div>
            <div className={cn('min-w-0 text-center md:text-left overflow-hidden', isRTL && 'md:order-1 md:text-right')}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 break-words" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.reems.title')}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mb-3 sm:mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.reems.subtitle')}
              </p>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-[55ch] md:max-w-none whitespace-pre-line break-words" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('about.reems.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 min-w-0">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={stat.valueKey} className="text-center min-w-0" dir={isRTL ? 'rtl' : 'ltr'}>
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-1">{stat.label}</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">{t(stat.valueKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
