'use client'

import React from "react"

import Link from 'next/link'
import { ArrowRight, Star, MapPin, Wifi, Utensils, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Hotel } from '@/lib/db'
import { cn } from '@/lib/utils'

interface FeaturedHotelsProps {
  hotels: Hotel[]
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Restaurant': <Utensils className="w-4 h-4" />,
  'Gym': <Dumbbell className="w-4 h-4" />,
}

export function FeaturedHotelsSection({ hotels }: FeaturedHotelsProps) {
  const { t, locale, isRTL } = useI18n()

  return (
    <section id="hotels" className="py-24 bg-muted/30 scroll-mt-[4.5rem]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              {t('home.featuredHotels')}
            </h2>
            <p className="text-muted-foreground max-w-xl">
              {t('home.featuredHotels.subtitle')}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 bg-transparent">
            <Link href="/hotels">
              {t('common.viewAll')}
              <ArrowRight className={cn("w-4 h-4 ml-2", isRTL && "rotate-180 mr-2 ml-0")} />
            </Link>
          </Button>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => {
            const name = getLocalizedContent(hotel, 'name', locale)
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
                style={{ animationDelay: `${index * 100}ms` }}
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
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{location}</span>
                    {hotel.distance_to_haram && (
                      <span className="text-primary font-medium">
                        ({hotel.distance_to_haram})
                      </span>
                    )}
                  </div>

                  {/* Amenities */}
                  {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {amenities.slice(0, 4).map((amenity, i) => (
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
                          /{locale === 'ar' ? 'ليلة' : 'night'}
                        </span>
                      </div>
                    </div>
                    <Button asChild size="sm">
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
      </div>
    </section>
  )
}
