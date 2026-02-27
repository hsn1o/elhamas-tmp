'use client'

import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n'

interface SimplePageHeroProps {
  titleKey: string
  subtitleKey: string
}

export function SimplePageHero({ titleKey, subtitleKey }: SimplePageHeroProps) {
  const { t } = useI18n()
  return (
    <>
      <PageHeader
        title={t(titleKey)}
        subtitle={t(subtitleKey)}
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Empty placeholder – content can be added later */}
        </div>
      </section>
    </>
  )
}
