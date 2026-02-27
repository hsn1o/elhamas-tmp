'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Banknote } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { SearchSortBar } from '@/components/search-sort-bar'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Event } from '@/lib/db'
import { cn } from '@/lib/utils'

const EVENTS_SORT_DEFAULT = 'dateAsc'

interface EventsPageClientProps {
  events: Event[]
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

function formatDateRange(start: Date, end: Date | null): string {
  const s = formatDate(start)
  if (!end) return s
  const e = formatDate(end)
  if (s === e) return s
  return `${s} – ${e}`
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const { t, locale } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(EVENTS_SORT_DEFAULT)

  const displayedEvents = useMemo(() => {
    let list = events
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((evt) => {
        const titleEn = evt.title_en ?? ''
        const titleAr = evt.title_ar ?? ''
        const descEn = evt.description_en ?? ''
        const descAr = evt.description_ar ?? ''
        const shortEn = evt.short_description_en ?? ''
        const shortAr = evt.short_description_ar ?? ''
        const locEn = evt.location_en ?? ''
        const locAr = evt.location_ar ?? ''
        const freqEn = evt.frequency_en ?? ''
        const freqAr = evt.frequency_ar ?? ''
        const price = (evt.price ?? '').toString()
        const searchable = [
          titleEn, titleAr, descEn, descAr, shortEn, shortAr,
          locEn, locAr, freqEn, freqAr, price,
        ]
          .join(' ')
          .toLowerCase()
        return searchable.includes(q)
      })
    }
    const sorted = [...list]
    const toTime = (d: Date) => (d instanceof Date ? d : new Date(d)).getTime()
    if (sortBy === 'dateAsc')
      sorted.sort((a, b) => toTime(a.event_date) - toTime(b.event_date))
    else if (sortBy === 'dateDesc')
      sorted.sort((a, b) => toTime(b.event_date) - toTime(a.event_date))
    else if (sortBy === 'priceAsc')
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    else if (sortBy === 'priceDesc')
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    else if (sortBy === 'nameAsc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? a.title_ar : a.title_en).localeCompare(locale === 'ar' ? b.title_ar : b.title_en)
      )
    else if (sortBy === 'nameDesc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? b.title_ar : b.title_en).localeCompare(locale === 'ar' ? a.title_ar : a.title_en)
      )
    return sorted
  }, [events, searchQuery, sortBy, locale])

  return (
    <>
      <PageHeader
        title={t('events.title')}
        subtitle={t('events.subtitle')}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <SearchSortBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={t('events.searchPlaceholder')}
              sortValue={sortBy}
              onSortChange={setSortBy}
              sortLabel={t('list.sortBy')}
              sortOptions={[
                { value: 'dateAsc', label: t('list.sort.dateAsc') },
                { value: 'dateDesc', label: t('list.sort.dateDesc') },
                { value: 'priceAsc', label: t('list.sort.priceAsc') },
                { value: 'priceDesc', label: t('list.sort.priceDesc') },
                { value: 'nameAsc', label: t('list.sort.nameAsc') },
                { value: 'nameDesc', label: t('list.sort.nameDesc') },
              ]}
              isRTL={locale === 'ar'}
              className="mb-6"
            />

            {displayedEvents.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center rounded-lg border border-dashed">
                {locale === 'ar' ? 'لا توجد فعاليات تطابق البحث.' : 'No events match your search.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEvents.map((evt, index) => {
                  const title = getLocalizedContent(
                    evt as unknown as Record<string, unknown>,
                    'title',
                    locale
                  )
                  const location = getLocalizedContent(
                    evt as unknown as Record<string, unknown>,
                    'location',
                    locale
                  )
                  const frequency = getLocalizedContent(
                    evt as unknown as Record<string, unknown>,
                    'frequency',
                    locale
                  )
                  const bannerText = frequency || formatDateRange(evt.event_date, evt.end_date)
                  const img = evt.featured_image || '/images/package-default.jpg'
                  const priceStr = evt.price != null ? `${evt.price} ${evt.currency}` : null

                  return (
                    <article
                      key={evt.id}
                      className={cn(
                        'group flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden',
                        'hover:border-primary/30 hover:shadow-xl transition-all duration-300',
                        'animate-fade-in-up'
                      )}
                      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                    >
                      <Link href={`/blog/events/${evt.slug}`} className="flex flex-col h-full">
                        <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-x-0 bottom-0 z-10 bg-primary py-2 px-4">
                            <p className="text-sm font-semibold text-white text-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                              {bannerText}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col p-6 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                            {title}
                          </h3>
                          {location && (
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-4 h-4 shrink-0 text-primary" />
                              <span>{location}</span>
                            </p>
                          )}
                          {priceStr && (
                            <p className="flex items-center gap-1.5 text-sm font-medium text-primary mb-4">
                              <Banknote className="w-4 h-4 shrink-0" />
                              <span>{priceStr}</span>
                            </p>
                          )}
                        </div>
                        <div className="p-6 pt-0">
                          <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground w-full">
                            {t('events.bookNow')}
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
