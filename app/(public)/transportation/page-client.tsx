'use client'

import Link from 'next/link'
import { Users, Check, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Transportation } from '@/lib/db'
import { cn } from '@/lib/utils'

interface TransportationPageClientProps {
  transportation: Transportation[]
}

export function TransportationPageClient({ transportation }: TransportationPageClientProps) {
  const { t, locale, isRTL } = useI18n()

  return (
    <>
      <PageHeader
        title={t('transport.title')}
        subtitle={t('transport.subtitle')}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Transportation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transportation.map((vehicle, index) => {
              const name = getLocalizedContent(vehicle, 'name', locale)
              const description = getLocalizedContent(vehicle, 'description', locale)
              const features = vehicle.features || []
              
              return (
                <div
                  key={vehicle.id}
                  className={cn(
                    "group relative rounded-2xl bg-card border border-border/50 overflow-hidden",
                    "hover:border-primary/30 hover:shadow-2xl transition-all duration-500",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: vehicle.images?.[0] 
                          ? `url(${vehicle.images[0]})` 
                          : 'url(/images/transport-default.jpg)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Vehicle Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        <Car className="w-3 h-3 mr-1" />
                        {vehicle.vehicle_type}
                      </Badge>
                    </div>
                    
                    {/* Capacity */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {vehicle.capacity} {t('common.guests')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {description}
                    </p>

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-foreground mb-3">
                          {t('transport.features')}:
                        </h4>
                        <ul className="space-y-2">
                          {features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-primary shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mb-4">
                      <div>
                        <span className="text-xs text-muted-foreground">{t('transport.perTrip')}</span>
                        <div className="text-lg font-bold text-primary">
                          {vehicle.currency} {vehicle.price_per_trip?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{t('transport.perDay')}</span>
                        <div className="text-lg font-bold text-primary">
                          {vehicle.currency} {vehicle.price_per_day?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href="/contact">
                        {t('common.bookNow')}
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {transportation.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد وسائل نقل متاحة حالياً' : 'No transportation available at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
