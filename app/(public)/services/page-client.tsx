'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const services = [
  {
    image: '/images/visa.png',
    titleKey: 'services.visas.title' as const,
    descKey: 'services.visas.desc' as const,
    explanationKey: 'services.visas.explanation' as const,
    href: '/visas',
  },
  {
    image: '/images/hotel.jpeg',
    titleKey: 'services.hotels.title' as const,
    descKey: 'services.hotels.desc' as const,
    explanationKey: 'services.hotels.explanation' as const,
    href: '/hotels',
  },
  {
    image: '/images/transportation.jpg',
    titleKey: 'services.transportation.title' as const,
    descKey: 'services.transportation.desc' as const,
    explanationKey: 'services.transportation.explanation' as const,
    href: '/transportation',
  },
]

export function ServicesPageClient() {
  const { t, locale, isRTL } = useI18n()

  return (
    <>
      <PageHeader
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16 md:mb-20">
            <p
              className="text-lg text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto"
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
              {locale === 'ar'
                ? 'نقدم مجموعة متكاملة من الخدمات لتلبية احتياجات رحلتك من التأشيرات والإقامة إلى النقل، مع حرصنا على الجودة والشفافية.'
                : 'We offer a full range of services for your journey—from visas and accommodation to transportation—with a focus on quality and transparency.'}
            </p>
          </div>

          <div className="space-y-24 md:space-y-32 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <article
                key={service.href}
                className={cn(
                  'rounded-2xl border border-border bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]',
                  'transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-2 gap-0',
                    index % 2 === 1 && 'md:grid-flow-dense'
                  )}
                >
                  <div
                    className={cn(
                      'relative aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-muted',
                      index % 2 === 1 && 'md:col-start-2'
                    )}
                  >
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                  <div
                    className={cn(
                      'flex flex-col justify-center p-8 md:p-10 lg:p-12',
                      index % 2 === 1 && 'md:col-start-1 md:row-start-1'
                    )}
                  >
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 tracking-tight">
                      {t(service.titleKey)}
                    </h2>
                    <p className="text-muted-foreground font-medium mb-4">
                      {t(service.descKey)}
                    </p>
                    <p
                      className="text-muted-foreground text-[15px] leading-relaxed mb-6 max-w-[65ch]"
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {t(service.explanationKey)}
                    </p>
                    <Button asChild className="w-fit">
                      <Link href={service.href} className="gap-2">
                        {t('common.learnMore')}
                        <span className={cn('inline-block', isRTL && 'rotate-180')}>
                          →
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
