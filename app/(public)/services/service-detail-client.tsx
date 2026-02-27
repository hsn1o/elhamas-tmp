'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface ServiceDetailClientProps {
  titleKey: string
  subtitleKey: string
}

export function ServiceDetailClient({ titleKey, subtitleKey }: ServiceDetailClientProps) {
  const { t, locale } = useI18n()
  return (
    <>
      <PageHeader
        title={t(titleKey)}
        subtitle={t(subtitleKey)}
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className={cn('w-4 h-4', locale === 'ar' && 'rotate-180')} />
            {locale === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
          {/* Detail content can be added here later */}
        </div>
      </section>
    </>
  )
}
