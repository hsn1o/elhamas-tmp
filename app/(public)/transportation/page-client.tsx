'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Car } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { SearchSortBar } from '@/components/search-sort-bar'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Transportation } from '@/lib/db'
import { cn } from '@/lib/utils'

const TRANSPORT_SORT_DEFAULT = 'priceAsc'

interface TransportationPageClientProps {
  items: Transportation[]
}

function getPriceForSort(item: Transportation): number {
  const p = item.price_per_trip ?? item.price_per_day
  return p != null ? Number(p) : 0
}

export function TransportationPageClient({ items }: TransportationPageClientProps) {
  const { t, locale } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(TRANSPORT_SORT_DEFAULT)

  const displayedItems = useMemo(() => {
    let list = items
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((item) => {
        const nameEn = item.name_en ?? ''
        const nameAr = item.name_ar ?? ''
        const descEn = item.description_en ?? ''
        const descAr = item.description_ar ?? ''
        const vehicleEn = item.vehicle_type ?? ''
        const vehicleAr = item.vehicle_type_ar ?? ''
        const locEn = item.location_en ?? ''
        const locAr = item.location_ar ?? ''
        const capacity = (item.capacity ?? '').toString()
        const priceTrip = (item.price_per_trip ?? '').toString()
        const priceDay = (item.price_per_day ?? '').toString()
        const features = [...(item.features ?? []), ...(item.features_ar ?? [])].join(' ')
        const searchable = [nameEn, nameAr, descEn, descAr, vehicleEn, vehicleAr, locEn, locAr, capacity, priceTrip, priceDay, features]
          .join(' ')
          .toLowerCase()
        return searchable.includes(q)
      })
    }
    const sorted = [...list]
    if (sortBy === 'priceAsc')
      sorted.sort((a, b) => getPriceForSort(a) - getPriceForSort(b))
    else if (sortBy === 'priceDesc')
      sorted.sort((a, b) => getPriceForSort(b) - getPriceForSort(a))
    else if (sortBy === 'nameAsc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? a.name_ar : a.name_en).localeCompare(locale === 'ar' ? b.name_ar : b.name_en)
      )
    else if (sortBy === 'nameDesc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? b.name_ar : b.name_en).localeCompare(locale === 'ar' ? a.name_ar : a.name_en)
      )
    else if (sortBy === 'capacityAsc')
      sorted.sort((a, b) => (a.capacity ?? 0) - (b.capacity ?? 0))
    else if (sortBy === 'capacityDesc')
      sorted.sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0))
    return sorted
  }, [items, searchQuery, sortBy, locale])

  const displayPrice = (item: Transportation) => {
    const p = item.price_per_trip ?? item.price_per_day
    if (p == null) return null
    return `${item.currency} ${Number(p).toLocaleString()}`
  }

  const location = (item: Transportation) =>
    locale === 'ar' ? (item.location_ar || item.location_en) : (item.location_en || item.location_ar)

  return (
    <>
      <PageHeader
        title={t('transport.title')}
        subtitle={t('transport.subtitle')}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SearchSortBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t('transport.searchPlaceholder')}
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortLabel={t('list.sortBy')}
            sortOptions={[
              { value: 'priceAsc', label: t('list.sort.priceAsc') },
              { value: 'priceDesc', label: t('list.sort.priceDesc') },
              { value: 'nameAsc', label: t('list.sort.nameAsc') },
              { value: 'nameDesc', label: t('list.sort.nameDesc') },
              { value: 'capacityAsc', label: t('list.sort.capacityAsc') },
              { value: 'capacityDesc', label: t('list.sort.capacityDesc') },
            ]}
            isRTL={locale === 'ar'}
            className="mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item, index) => {
              const name = getLocalizedContent(
                item as unknown as Record<string, unknown>,
                'name',
                locale,
              )
              const priceStr = displayPrice(item)
              const loc = location(item)

              return (
                <article
                  key={item.id}
                  className={cn(
                    'group flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden',
                    'hover:border-primary/30 hover:shadow-xl transition-all duration-300',
                    'animate-fade-in-up',
                  )}
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <Link href={`/transportation/${item.id}`} className="flex flex-col h-full">
                    <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: item.images?.[0]
                            ? `url(${item.images[0]})`
                            : 'linear-gradient(135deg, #751f27 0%, #4a1c20 100%)',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <div className="flex-1 flex flex-col p-6 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                        {name}
                      </h3>
                      {loc && (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4 shrink-0 text-primary" />
                          <span>{loc}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <Car className="w-4 h-4 shrink-0 text-primary" />
                        <span>
                          {item.capacity} {t('transport.seats')}
                        </span>
                      </p>
                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                        {priceStr && (
                          <div className="min-w-0">
                            <span className="text-xl font-bold text-primary">
                              {priceStr}
                            </span>
                            <span className="text-sm text-muted-foreground block">
                              {item.price_per_trip != null
                                ? t('transport.perTrip')
                                : t('transport.perDay')}
                            </span>
                          </div>
                        )}
                        <span
                          className={cn(
                            'shrink-0 px-4 py-2 rounded-md text-sm font-medium',
                            'bg-primary text-primary-foreground',
                            'group-hover:bg-primary/90 transition-colors',
                          )}
                        >
                          {t('common.bookNow')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>

          {displayedItems.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد خدمات نقل تطابق البحث' : 'No transportation services match your search.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
