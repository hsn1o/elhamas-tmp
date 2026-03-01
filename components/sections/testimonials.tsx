'use client'

import { Star, Quote } from 'lucide-react'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Testimonial } from '@/lib/db'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useEffect, useState } from 'react'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t, locale, isRTL } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (!testimonials.length) return null

  return (
    <section className="relative py-10 sm:py-14 md:py-16 lg:py-24 overflow-hidden">
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      <div className="container relative z-10 mx-auto px-3 sm:px-4 min-w-0">
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground break-words" dir={isRTL ? 'rtl' : 'ltr'}>
            <span className="text-foreground">{locale === 'ar' ? 'آراء' : 'Client '}</span>
            <span className="text-primary">{locale === 'ar' ? ' العملاء' : 'Testimonials'}</span>
          </h2>
          <p className="mt-2 sm:mt-3 text-muted-foreground text-sm sm:text-base md:text-lg break-words" dir={isRTL ? 'rtl' : 'ltr'}>
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        <div className="relative px-8 sm:px-10 md:px-14 lg:px-20">
          <Carousel
            key={isRTL ? 'rtl' : 'ltr'}
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
            className="w-full"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6">
              {testimonials.map((testimonial) => {
                const name = getLocalizedContent(testimonial, 'name', locale)
                const content = getLocalizedContent(testimonial, 'content', locale)
                const work = getLocalizedContent(testimonial, 'work', locale)
                const rating = Math.min(5, Math.max(1, testimonial.rating || 0))

                return (
                  <CarouselItem
                    key={testimonial.id}
                    className="pl-3 sm:pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className="h-full rounded-lg sm:rounded-xl bg-card border border-border shadow-sm p-4 sm:p-6 flex flex-col min-w-0"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-3 sm:mb-4 shrink-0" aria-hidden />
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed flex-1 mb-3 sm:mb-4 break-words">
                        &ldquo;{content}&rdquo;
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-4 h-4 shrink-0',
                              i < rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'
                            )}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <p className="font-semibold text-foreground">{name}</p>
                      {work ? (
                        <p className="text-sm text-muted-foreground mt-0.5">{work}</p>
                      ) : null}
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                'left-0 border-border bg-card text-foreground hover:bg-muted',
                isRTL && 'left-auto right-0 [&>svg]:scale-x-[-1]'
              )}
            />
            <CarouselNext
              className={cn(
                'right-0 border-border bg-card text-foreground hover:bg-muted',
                isRTL && 'right-auto left-0 [&>svg]:scale-x-[-1]'
              )}
            />
          </Carousel>

          {count > 0 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={locale === 'ar' ? `الصفحة ${i + 1}` : `Page ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    current === i + 1 ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
