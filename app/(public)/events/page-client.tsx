'use client'

import Link from 'next/link'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Event } from '@/lib/db'
import { cn } from '@/lib/utils'

interface EventsPageClientProps {
  events: Event[]
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const { t, locale, isRTL } = useI18n()

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageHeader
        title={t('events.title')}
        subtitle={t('events.subtitle')}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const title = getLocalizedContent(event, 'title', locale)
              const description = getLocalizedContent(event, 'description', locale)
              const location = getLocalizedContent(event, 'location', locale)
              
              return (
                <div
                  key={event.id}
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
                        backgroundImage: event.images?.[0] 
                          ? `url(${event.images[0]})` 
                          : 'url(/images/event-default.jpg)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Date Badge */}
                    {event.event_date && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-white rounded-lg p-2 text-center shadow-lg">
                          <div className="text-2xl font-bold text-primary">
                            {new Date(event.event_date).getDate()}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase">
                            {new Date(event.event_date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1">
                      {title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      {event.event_time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span>{event.event_time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>{location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-primary shrink-0" />
                          <span>{event.capacity} {t('common.guests')}</span>
                        </div>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground">{t('common.startingFrom')}</span>
                        <div className="text-xl font-bold text-primary">
                          {event.currency} {event.price?.toLocaleString()}
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/events/${event.id}`}>
                          {t('common.bookNow')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد فعاليات قادمة حالياً' : 'No upcoming events at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
