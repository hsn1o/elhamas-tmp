'use client'

import React from "react"

import Link from 'next/link'
import { Star, MapPin, Wifi, Utensils, Dumbbell, Car, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Hotel } from '@/lib/db'
import { cn } from '@/lib/utils'

interface HotelsPageClientProps {
  hotels: Hotel[]
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Restaurant': <Utensils className="w-4 h-4" />,
  'Gym': <Dumbbell className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Room Service': <Coffee className="w-4 h-4" />,
}

export function HotelsPageClient({ hotels }: HotelsPageClientProps) {
  const { t, locale, isRTL } = useI18n()

  return (
    <>
      <PageHeader
        title={t('hotels.title')}
        subtitle={t('hotels.subtitle')}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters - can be expanded later */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {locale === 'ar' ? 'الكل' : 'All'}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Makkah
            </Badge>
            <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              Madinah
            </Badge>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, index) => {
              const name = getLocalizedContent(hotel, 'name', locale)
              const description = getLocalizedContent(hotel, 'description', locale)
              const location = getLocalizedContent(hotel, 'location', locale)
              const amenities = hotel.amenities || []
              
              return (
                <div
                  key={hotel.id}
                  className={cn(
                    "group relative rounded-2xl bg-card border border-border/50 overflow-hidden",
                    "hover:border-primary/30 hover:shadow-2xl transition-all duration-500",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: hotel.images?.[0] 
                          ? `url(${hotel.images[0]})` 
                          : 'url(/images/hotel-default.jpg)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* City Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {hotel.city}
                      </Badge>
                    </div>
                    
                    {/* Star Rating */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{hotel.star_rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1">
                      {name}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">{location}</span>
                    </div>

                    {/* Distance */}
                    {hotel.distance_to_haram && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                        {t('hotels.distanceToHaram')}: {hotel.distance_to_haram}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {description}
                    </p>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {amenities.slice(0, 5).map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                          >
                            {amenityIcons[amenity] || null}
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground">{t('common.startingFrom')}</span>
                        <div className="text-2xl font-bold text-primary">
                          {hotel.currency} {hotel.price_per_night?.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{t('common.perNight')}
                          </span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/hotels/${hotel.id}`}>
                          {t('common.bookNow')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {hotels.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد فنادق متاحة حالياً' : 'No hotels available at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
