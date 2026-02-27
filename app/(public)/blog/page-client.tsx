'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const sections = [
  {
    href: '/blog/articles',
    image: '/images/riy.jpg',
    titleKey: 'blog.articles' as const,
  },
  {
    href: '/blog/events',
    image: '/images/events.jpg',
    titleKey: 'blog.events' as const,
  },
]

export function BlogPageClient() {
  const { t, locale } = useI18n()

  return (
    <>
      <PageHeader
        title={t('blog.title')}
        subtitle={t('blog.subtitle')}
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sections.map((section, index) => (
              <Link
                key={section.href}
                href={section.href}
                className={cn(
                  'group block rounded-2xl overflow-hidden bg-card border border-border',
                  'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]',
                  'hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden">
                  <Image
                    src={section.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient so the label band always has contrast */}
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/70 to-transparent z-[1]" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 z-10 py-4 px-6 bg-primary">
                    <h2
                      className="text-xl md:text-2xl font-bold text-white drop-shadow-sm"
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {t(section.titleKey)}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
