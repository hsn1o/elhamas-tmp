'use client'

import Link from 'next/link'
import { Calendar, Check, Users, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { TourPackage } from '@/lib/db'
import { cn } from '@/lib/utils'

interface PackagesPageClientProps {
  packages: TourPackage[]
}

export function PackagesPageClient({ packages }: PackagesPageClientProps) {
  const { t, locale, isRTL } = useI18n()

  return (
    <>
      <PageHeader
        title={t('packages.title')}
        subtitle={t('packages.subtitle')}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {locale === 'ar' ? 'الكل' : 'All'}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {t('packages.hajj')}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {t('packages.umrah')}
            </Badge>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => {
              const name = getLocalizedContent(pkg, 'name', locale)
              const description = getLocalizedContent(pkg, 'description', locale)
              const includes = pkg.includes || []
              
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "group relative rounded-2xl bg-card border border-border/50 overflow-hidden",
                    "hover:border-primary/30 hover:shadow-2xl transition-all duration-500",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-72 h-56 md:h-auto overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60" />
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: pkg.images?.[0] 
                            ? `url(${pkg.images[0]})` 
                            : 'url(/images/package-default.jpg)',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={cn(
                          "text-white",
                          pkg.package_type === 'hajj' ? 'bg-primary' : 'bg-secondary text-secondary-foreground'
                        )}>
                          {pkg.package_type === 'hajj' ? t('packages.hajj') : t('packages.umrah')}
                        </Badge>
                      </div>
                      
                      {/* Duration */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {pkg.duration_days} {t('common.days')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {description}
                      </p>

                      {/* Includes */}
                      {includes.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            {t('packages.includes')}:
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {includes.slice(0, 6).map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary shrink-0" />
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <span className="text-xs text-muted-foreground">{t('common.startingFrom')}</span>
                          <div className="text-2xl font-bold text-primary">
                            {pkg.currency} {pkg.price?.toLocaleString()}
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/packages/${pkg.id}`}>
                            {t('common.bookNow')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {packages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد باقات متاحة حالياً' : 'No packages available at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
