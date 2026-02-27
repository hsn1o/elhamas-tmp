'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { SearchSortBar } from '@/components/search-sort-bar'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Hotel, HotelLocation } from '@/lib/db'
import { cn } from '@/lib/utils'

const HOTEL_SORT_DEFAULT = 'priceAsc'

const LOCATION_IMAGE_INTERVAL_MS = 4000

function LocationCard({
  title,
  imageUrl,
  imageUrls,
  isSelected,
  onClick,
  locale,
}: {
  title: string
  imageUrl: string | null
  imageUrls?: string[]
  isSelected: boolean
  onClick: () => void
  locale: string
}) {
  const urls = imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (urls.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length)
    }, LOCATION_IMAGE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [urls.length])

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-end w-full rounded-2xl overflow-hidden',
        'min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105',
            urls.length > 0 && 'animate-slow-zoom-in'
          )}
        >
          {urls.length === 0 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'linear-gradient(135deg, #751f27 0%, #4a1c20 100%)',
              }}
            />
          ) : urls.length === 1 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${urls[0]})` }}
            />
          ) : (
            urls.map((url, i) => (
              <div
                key={url}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
                style={{
                  backgroundImage: `url(${url})`,
                  opacity: (index % urls.length) === i ? 1 : 0,
                  zIndex: (index % urls.length) === i ? 0 : -1,
                }}
              />
            ))
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-[#751f27] opacity-90"
        style={{ clipPath: 'polygon(0 40%, 100% 20%, 100% 100%, 0 100%)' }}
      />
      <div
        className={cn(
          'relative z-10 px-6 pb-8 pt-4',
          locale === 'ar' ? 'text-right' : 'text-left'
        )}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <span className="font-bold text-white drop-shadow-lg block text-xl sm:text-2xl">
          {title}
        </span>
      </div>
    </button>
  )
}

interface HotelsPageClientProps {
  locations: HotelLocation[]
  hotels: Hotel[]
}

function getLocationName(loc: HotelLocation, locale: string) {
  return locale === 'ar' ? loc.name_ar : loc.name_en
}

export function HotelsPageClient({ locations, hotels }: HotelsPageClientProps) {
  const { t, locale } = useI18n()
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(HOTEL_SORT_DEFAULT)

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchesLocation = !selectedLocationId || h.location_id === selectedLocationId
      return matchesLocation
    })
  }, [hotels, selectedLocationId])

  const displayedHotels = useMemo(() => {
    let list = filteredHotels
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((h) => {
        const nameEn = h.name_en ?? ''
        const nameAr = h.name_ar ?? ''
        const descEn = h.description_en ?? ''
        const descAr = h.description_ar ?? ''
        const city = (locale === 'ar' ? h.city_ar || h.city : h.city) ?? ''
        const locEn = h.location_en ?? ''
        const locAr = h.location_ar ?? ''
        const star = (h.star_rating ?? '').toString()
        const price = (h.price_per_night ?? '').toString()
        const distance = h.distance_to_haram ?? ''
        const amenities = [...(h.amenities ?? []), ...(h.amenities_ar ?? [])].join(' ')
        const searchable = [nameEn, nameAr, descEn, descAr, city, locEn, locAr, star, price, distance, amenities]
          .join(' ')
          .toLowerCase()
        return searchable.includes(q)
      })
    }
    const sorted = [...list]
    if (sortBy === 'priceAsc')
      sorted.sort((a, b) => (a.price_per_night ?? 0) - (b.price_per_night ?? 0))
    else if (sortBy === 'priceDesc')
      sorted.sort((a, b) => (b.price_per_night ?? 0) - (a.price_per_night ?? 0))
    else if (sortBy === 'nameAsc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? a.name_ar : a.name_en).localeCompare(locale === 'ar' ? b.name_ar : b.name_en)
      )
    else if (sortBy === 'nameDesc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? b.name_ar : b.name_en).localeCompare(locale === 'ar' ? a.name_ar : a.name_en)
      )
    else if (sortBy === 'starDesc')
      sorted.sort((a, b) => (b.star_rating ?? 0) - (a.star_rating ?? 0))
    else if (sortBy === 'starAsc')
      sorted.sort((a, b) => (a.star_rating ?? 0) - (b.star_rating ?? 0))
    return sorted
  }, [filteredHotels, searchQuery, sortBy, locale])

  const selectedLocation = locations.find((l) => l.id === selectedLocationId)
  const showHotels = selectedLocationId !== null

  const goBack = () => setSelectedLocationId(null)

  return (
    <>
      <PageHeader
        title={t('hotels.title')}
        subtitle={t('hotels.subtitle')}
      />

      {!showHotels && (
        <section className="min-h-[calc(100vh-var(--header-height,64px)-180px)] flex flex-col py-8 sm:py-12">
          <div className="container mx-auto px-4 flex-1 flex flex-col">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6 flex-1 content-start max-w-6xl mx-auto justify-items-center w-full">
              {locations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  title={getLocationName(loc, locale)}
                  imageUrl={loc.image_url}
                  imageUrls={loc.image_urls?.length ? loc.image_urls : undefined}
                  isSelected={selectedLocationId === loc.id}
                  onClick={() => setSelectedLocationId(selectedLocationId === loc.id ? null : loc.id)}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {showHotels && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className={cn('mb-4 gap-2', locale === 'ar' ? 'flex-row-reverse ms-auto' : '')}
              onClick={goBack}
            >
              <ArrowLeft className={cn('w-4 h-4', locale === 'ar' && 'rotate-180')} />
              {t('hotels.backToPlaces')}
            </Button>
            {selectedLocation && (
              <p className="text-muted-foreground mb-6">
                {t('hotels.hotelsIn')} {getLocationName(selectedLocation, locale)}
              </p>
            )}

            <SearchSortBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={t('hotels.searchPlaceholder')}
              sortValue={sortBy}
              onSortChange={setSortBy}
              sortLabel={t('list.sortBy')}
              sortOptions={[
                { value: 'priceAsc', label: t('list.sort.priceAsc') },
                { value: 'priceDesc', label: t('list.sort.priceDesc') },
                { value: 'nameAsc', label: t('list.sort.nameAsc') },
                { value: 'nameDesc', label: t('list.sort.nameDesc') },
                { value: 'starDesc', label: t('list.sort.starDesc') },
                { value: 'starAsc', label: t('list.sort.starAsc') },
              ]}
              isRTL={locale === 'ar'}
              className="mb-6"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedHotels.map((hotel, index) => {
                const name = getLocalizedContent(hotel as unknown as Record<string, unknown>, 'name', locale)
                const description =
                  getLocalizedContent(hotel as unknown as Record<string, unknown>, 'description', locale) ||
                  getLocalizedContent(hotel as unknown as Record<string, unknown>, 'short_description', locale)

                return (
                  <article
                    key={hotel.id}
                    className={cn(
                      'group flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden',
                      'hover:border-primary/30 hover:shadow-xl transition-all duration-300',
                      'animate-fade-in-up'
                    )}
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  >
                    <Link href={`/hotels/${hotel.id}`} className="flex flex-col h-full">
                      <div className="flex flex-col md:flex-row md:min-h-[280px]">
                        <div className="relative w-full md:w-64 h-48 md:h-auto md:min-h-[280px] shrink-0 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: hotel.images?.[0]
                                ? `url(${hotel.images[0]})`
                                : 'linear-gradient(135deg, #751f27 0%, #4a1c20 100%)',
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-white text-sm font-medium">
                            <Star className="w-4 h-4 fill-current" />
                            {hotel.star_rating}
                          </div>
                          {hotel.distance_to_haram && (
                            <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                              {t('hotels.distanceToHaram')}: {hotel.distance_to_haram}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col p-6 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                            {name}
                          </h3>
                          {(locale === 'ar' ? hotel.city_ar || hotel.city : hotel.city) && (
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-4 h-4 shrink-0 text-primary" />
                              <span>{locale === 'ar' ? hotel.city_ar || hotel.city : hotel.city}</span>
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-shrink-0">
                            {description}
                          </p>
                          {(() => {
                            const en = hotel.amenities ?? []
                            const ar = hotel.amenities_ar ?? []
                            const list = en.slice(0, 3).map((_, i) => (locale === 'ar' && ar[i] ? ar[i] : en[i])).filter(Boolean)
                            return list.length > 0 ? (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                {list.join(' • ')}
                              </p>
                            ) : null
                          })()}
                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <span className="text-xs text-muted-foreground block">
                                {locale === 'ar' ? 'ابتداءً من' : 'From'}
                              </span>
                              <span className="text-xl font-bold text-primary">
                                {hotel.currency} {hotel.price_per_night?.toLocaleString()}{' '}
                                <span className="text-sm font-normal text-muted-foreground">
                                  / {locale === 'ar' ? 'ليلة' : 'night'}
                                </span>
                              </span>
                            </div>
                            <span
                              className={cn(
                                'shrink-0 px-4 py-2 rounded-md text-sm font-medium',
                                'bg-primary text-primary-foreground',
                                'group-hover:bg-primary/90 transition-colors'
                              )}
                            >
                              {t('common.bookNow')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>

            {displayedHotels.length === 0 && (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">
                  {locale === 'ar' ? 'لا توجد فنادق تطابق البحث' : 'No hotels match your search'}
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Button variant="outline" onClick={goBack}>
                    {t('hotels.backToPlaces')}
                  </Button>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    {locale === 'ar' ? 'مسح البحث' : 'Clear search'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
