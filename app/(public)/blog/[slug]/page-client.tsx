'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { BlogPost } from '@/lib/db'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleDetailClientProps {
  post: BlogPost
}

function formatDate(d: Date | null): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ArticleDetailClient({ post }: ArticleDetailClientProps) {
  const { t, locale } = useI18n()

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
  const content = getLocalizedContent(
    post as unknown as Record<string, unknown>,
    'content',
    locale
  )
  const dateStr = formatDate(post.published_at ?? post.created_at)
  const img = post.featured_image || '/images/package-default.jpg'

  return (
    <>
      {/* Hero: featured image + title */}
      <section className="relative min-h-[320px] md:min-h-[380px] flex flex-col justify-end overflow-hidden pt-24">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
        <div className="relative z-10 container mx-auto px-4 pb-10">
          <Link href="/blog/articles" className="inline-block mb-6">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className={cn('h-4 w-4', locale === 'ar' && 'rotate-180')} />
              {t('blog.allArticles')}
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg max-w-4xl" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {title}
          </h1>
        </div>
      </section>

      {/* Place & date in white card (like hotel info bar) */}
      <div className="relative z-20 -mt-6 px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div
            className={cn(
              'rounded-2xl bg-white border border-border shadow-lg px-6 py-4',
              'flex flex-wrap items-center gap-6 md:gap-8 text-sm',
              locale === 'ar' ? 'flex-row-reverse justify-center md:justify-start' : 'justify-center md:justify-start'
            )}
          >
            {place && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {place}
              </span>
            )}
            {dateStr && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                {dateStr}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Short description in card */}
      {excerpt && (
        <section className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 md:p-8">
            <p className="text-lg text-muted-foreground leading-relaxed" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {excerpt}
            </p>
          </div>
        </section>
      )}

      {/* Content: markdown */}
      <section className="container mx-auto px-4 pb-20 pt-4 max-w-4xl">
        <div
          className={cn(
            'prose prose-lg max-w-none dark:prose-invert',
            'prose-headings:font-semibold prose-p:leading-relaxed',
            'prose-a:text-primary prose-img:rounded-xl',
            locale === 'ar' && 'prose-body:rtl'
          )}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ''}</ReactMarkdown>
        </div>
      </section>
    </>
  )
}
