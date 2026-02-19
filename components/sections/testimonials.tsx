'use client'

import { Star, Quote } from 'lucide-react'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Testimonial } from '@/lib/db'
import { cn } from '@/lib/utils'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsProps) {
  const { t, locale } = useI18n()
  const testimonial = testimonials[0]
  if (!testimonial) return null

  const name = getLocalizedContent(testimonial, 'name', locale)
  const content = getLocalizedContent(testimonial, 'content', locale)

  return (
    <section className="py-0 border-b border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
        {/* Left – light gray + testimonial card */}
        <div className="bg-muted/50 flex items-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {locale === 'ar' ? 'ماذا يقول عملاؤنا' : "What's our Client say"}
            </h2>
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <p className="text-foreground leading-relaxed mb-4">&ldquo;{content}&rdquo;</p>
              <div className="font-semibold text-foreground">{name}</div>
              <p className="text-sm text-muted-foreground mb-2">
                {locale === 'ar' ? 'رائد أعمال' : 'Online entrepreneur'}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('w-4 h-4', i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30')}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        </div>
        {/* Right – large image */}
        <div
          className="hidden lg:block min-h-[400px] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540331547164-8b63109225b7?w=800&q=80')`,
          }}
        />
      </div>
    </section>
  )
}
