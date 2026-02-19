'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function CTASection() {
  const { t, locale, isRTL } = useI18n()

  return (
    <section className="relative py-16 sm:py-20 bg-charcoal overflow-hidden border-b border-charcoal">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1540331547164-8b63109225b7?w=1200&q=60')`,
        }}
      />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </h2>
        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-8">
          {locale === 'ar'
            ? 'نسعد بتواصلك. واتساب، بريد إلكتروني أو نموذج الاتصال—نعرض معلومات الاتصال بشكل واضح.'
            : 'We\'re happy to hear from you. WhatsApp, email, or contact form—we display contact info clearly.'}
        </p>
        <div className={cn('flex flex-wrap items-center justify-center gap-4', isRTL && 'flex-row-reverse')}>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 font-medium">
            <Link href="https://wa.me/966566610996" target="_blank" rel="noopener noreferrer">
              {locale === 'ar' ? 'تواصل واتساب' : 'Contact WhatsApp'}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 rounded-lg px-8 font-medium bg-transparent"
          >
            <Link href="/contact">
              {locale === 'ar' ? 'نموذج الاتصال' : 'Contact Form'}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
