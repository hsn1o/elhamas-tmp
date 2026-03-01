'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { BlogPost } from '@/lib/db'
import { cn } from '@/lib/utils'

interface ArticlesPageClientProps {
  articles: BlogPost[]
}

function formatDate(d: Date | null): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  const { t, locale } = useI18n()

  return (
    <>
      <PageHeader
        title={t('blog.articles')}
        subtitle={t('blog.allArticles')}
      />

      <section className="py-8 sm:py-10 md:py-12 lg:py-16 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 min-w-0">
          <div className="max-w-5xl mx-auto">
            {articles.length === 0 ? (
              <p className="text-muted-foreground py-10 sm:py-12 text-center rounded-xl border border-dashed text-sm px-4">
                {locale === 'ar' ? 'لا توجد مقالات بعد.' : 'No articles yet.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {articles.map((post, index) => {
                  const title = getLocalizedContent(
                    post as unknown as Record<string, unknown>,
                    'title',
                    locale
                  )
                  const place = getLocalizedContent(
                    post as unknown as Record<string, unknown>,
                    'place',
                    locale
                  )
                  const excerpt = getLocalizedContent(
                    post as unknown as Record<string, unknown>,
                    'excerpt',
                    locale
                  )
                  const dateStr = formatDate(post.published_at ?? post.created_at)
                  const img = post.featured_image || '/images/package-default.jpg'

                  return (
                    <article
                      key={post.id}
                      className={cn(
                        'group flex flex-col h-full rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden min-w-0',
                        'hover:border-primary/30 hover:shadow-xl transition-all duration-300',
                        'animate-fade-in-up'
                      )}
                      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                    >
                      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full min-w-0">
                        <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                        <div className="flex-1 flex flex-col p-4 sm:p-6 min-w-0 overflow-hidden">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 line-clamp-2 break-words">
                            {title}
                          </h3>
                          {place && (
                            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-2 min-w-0">
                              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary" />
                              <span className="truncate">{place}</span>
                            </p>
                          )}
                          {excerpt && (
                            <p
                              className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 flex-1 break-words"
                              dir={locale === 'ar' ? 'rtl' : 'ltr'}
                            >
                              {excerpt}
                            </p>
                          )}
                          {dateStr && (
                            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary" />
                              <span>{dateStr}</span>
                            </p>
                          )}
                          <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary group-hover:underline">
                            {t('common.readMore')}
                            <span className={cn('inline-block', locale === 'ar' && 'rotate-180')}>→</span>
                          </span>
                        </div>
                      </Link>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
