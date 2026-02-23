'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { TourPackage, PackageCategory, Location } from '@/lib/db'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'hajj' | 'umrah'

interface PackagesPageClientProps {
  packages: TourPackage[]
  categories: PackageCategory[]
  locations: Location[]
}

function CategoryCard({
  title,
  imageUrl,
  isSelected,
  onClick,
  locale,
  size = 'default',
}: {
  title: string
  imageUrl: string | null
  isSelected: boolean
  onClick: () => void
  locale: string
  size?: 'default' | 'large'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-end w-full rounded-2xl overflow-hidden',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        size === 'large'
          ? 'min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]'
          : 'min-h-[200px] sm:min-h-[240px]'
      )}
    >
      {/* Background image or gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : 'linear-gradient(135deg, #751f27 0%, #751f27 50%, #751f27 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Dark green wave at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-[#751f27] opacity-90"
        style={{ clipPath: 'polygon(0 40%, 100% 20%, 100% 100%, 0 100%)' }}
      />

      {/* Lighter green wave accent */}
      <div
        className="absolute bottom-6 left-0 right-0 h-8 opacity-80"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(155, 37, 49, 0.4), transparent)',
          clipPath: 'polygon(0 60%, 50% 40%, 100% 60%, 100% 100%, 0 100%)',
        }}
      />

      {/* Text overlay */}
      <div
        className={cn(
          'relative z-10 px-6 pb-8 pt-4',
          locale === 'ar' ? 'text-right' : 'text-left',
          size === 'large' ? 'text-center' : ''
        )}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <span
          className={cn(
            'font-bold text-[#ffffff] drop-shadow-lg block',
            size === 'large' ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'
          )}
        >
          {title}
        </span>
      </div>
    </button>
  )
}

const LOCATIONS_VIEW = 'locations' as const
type ViewMode = 'categories' | typeof LOCATIONS_VIEW | 'category'

export function PackagesPageClient({
  packages,
  categories,
  locations,
}: PackagesPageClientProps) {
  const { t, locale } = useI18n()
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('categories')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const name = getLocalizedContent(pkg as unknown as Record<string, unknown>, 'name', locale).toLowerCase()
      const matchesType = filter === 'all' || pkg.package_type === filter
      const matchesSearch = !search.trim() || name.includes(search.trim().toLowerCase())
      const matchesCategory = !selectedCategoryId || pkg.category_id === selectedCategoryId
      const matchesLocation = !selectedLocationId || pkg.location_id === selectedLocationId
      return matchesType && matchesSearch && matchesCategory && matchesLocation
    })
  }, [packages, filter, search, locale, selectedCategoryId, selectedLocationId])

  const getCategoryName = (c: PackageCategory) =>
    locale === 'ar' ? `باقات ال${c.name_ar}` : `Packages of ${c.name_en}`
  const getLocationName = (l: Location) =>
    locale === 'ar' ? l.name_ar : l.name_en

  const goBack = () => {
    setView('categories')
    setSelectedCategoryId(null)
    setSelectedLocationId(null)
  }

  const showPackages = view === 'category' || (view === LOCATIONS_VIEW && selectedLocationId !== null)

  return (
    <>
      <PageHeader
        title={t('packages.title')}
        subtitle={t('packages.subtitle')}
      />

      {/* Full-page categories view (initial) */}
      {view === 'categories' && (
        <section className="min-h-[calc(100vh-var(--header-height,64px)-180px)] flex flex-col py-8 sm:py-12">
          <div className="container mx-auto px-4 flex-1 flex flex-col">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 flex-1 content-start max-w-5xl mx-auto justify-items-center w-full">
            <CategoryCard
                title={t('packages.discoverLocations')}
                imageUrl={locations[0]?.image_url ?? null}
                isSelected={false}
                onClick={() => {
                  setSelectedCategoryId(null)
                  setSelectedLocationId(null)
                  setView(LOCATIONS_VIEW)
                }}
                locale={locale}
                size="large"
              />
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  title={getCategoryName(cat)}
                  imageUrl={cat.image_url}
                  isSelected={false}
                  onClick={() => {
                    setSelectedCategoryId(cat.id)
                    setSelectedLocationId(null)
                    setView('category')
                  }}
                  locale={locale}
                  size="large"
                />
              ))}
              
            </div>
          </div>
        </section>
      )}

      {/* Full-page locations view (when Locations card clicked) */}
      {view === LOCATIONS_VIEW && (
        <section className="min-h-[calc(100vh-var(--header-height,64px)-180px)] flex flex-col py-8 sm:py-12 ">
          <div className="container mx-auto px-4 flex-1 flex flex-col">
            <Button
              variant="ghost"
              className={cn(
                'self-start mb-6 gap-2',
                locale === 'ar' ? 'flex-row-reverse' : ''
              )}
              onClick={goBack}
            >
              <ArrowLeft className={cn('w-4 h-4', locale === 'ar' && 'rotate-180')} />
              {t('packages.backToCategories')}
            </Button>
            {/* <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-8 text-center">
              {t('packages.selectLocation')}
            </h2> */}
            {locations.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                {locale === 'ar' ? 'لا توجد مواقع متاحة' : 'No locations available'}
              </p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 flex-1 content-start max-w-5xl mx-auto justify-items-center">
                {locations.map((loc) => (
                  <CategoryCard
                    key={loc.id}
                    title={getLocationName(loc)}
                    imageUrl={loc.image_url}
                    isSelected={selectedLocationId === loc.id}
                    onClick={() =>
                      setSelectedLocationId(selectedLocationId === loc.id ? null : loc.id)
                    }
                    locale={locale}
                    size="large"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Packages list (shown when category selected, or when location selected in Locations view) */}
      {showPackages && (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className={cn(
              'mb-4 gap-2',
              locale === 'ar' ? 'flex-row-reverse ms-auto' : ''
            )}
            onClick={goBack}
          >
            <ArrowLeft className={cn('w-4 h-4', locale === 'ar' && 'rotate-180')} />
            {t('packages.backToCategories')}
          </Button>
          {(selectedCategoryId || selectedLocationId) && (() => {
            const cat = categories.find((c) => c.id === selectedCategoryId)
            const loc = locations.find((l) => l.id === selectedLocationId)
            const name = selectedCategoryId ? (cat ? getCategoryName(cat) : '') : (loc ? getLocationName(loc) : '')
            return name ? <p className="text-muted-foreground mb-6">{t('packages.packagesIn')} {name}</p> : null
          })()}
          {/* Sticky filter & search bar */}
          <div
            className={cn(
              "sticky top-[var(--header-height,64px)] z-20 -mx-4 px-4 py-4 pt-10 mb-8",
              "bg-background/95 backdrop-blur-sm border-b border-border",
              "transition-shadow duration-200"
            )}
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                  locale === 'ar' ? "right-3" : "left-3"
                )} />
                <Input
                  type="search"
                  placeholder={t('packages.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn("h-11", locale === 'ar' ? "pr-10 pl-4" : "pl-10 pr-4")}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {(['all', 'hajj', 'umrah'] as const).map((f) => (
                  <Badge
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    className={cn(
                      "px-4 py-2 cursor-pointer transition-all duration-200",
                      filter === f
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-primary/10 hover:border-primary/30"
                    )}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? t('packages.filterAll') : t(`packages.${f}`)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Packages Grid - consistent card heights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPackages.map((pkg, index) => {
              const p = pkg as unknown as Record<string, unknown>
              const name = getLocalizedContent(p, 'name', locale)
              const description =
                getLocalizedContent(p, 'short_description', locale) ||
                getLocalizedContent(p, 'description', locale)
              const includes = locale === 'ar'
                ? (pkg.inclusions_ar?.length ? pkg.inclusions_ar : pkg.includes || [])
                : (pkg.includes || [])

              return (
                <article
                  key={pkg.id}
                  className={cn(
                    "group flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden",
                    "hover:border-primary/30 hover:shadow-xl transition-all duration-300",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <Link href={`/packages/${pkg.id}`} className="flex flex-col h-full">
                    <div className="flex flex-col md:flex-row md:min-h-[280px]">
                      {/* Image - fixed aspect & size */}
                      <div className="relative w-full md:w-64 h-48 md:h-auto md:min-h-[280px] shrink-0 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{
                            backgroundImage: pkg.images?.[0]
                              ? `url(${pkg.images[0]})`
                              : 'url(/images/package-default.jpg)',
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <Badge
                          className={cn(
                            "absolute top-3 left-3 text-white border-0",
                            pkg.package_type === 'hajj'
                              ? 'bg-primary'
                              : 'bg-secondary text-secondary-foreground'
                          )}
                        >
                          {pkg.package_type === 'hajj' ? t('packages.hajj') : t('packages.umrah')}
                        </Badge>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-medium">
                          <Calendar className="w-4 h-4 shrink-0" />
                          {pkg.duration_days} {t('common.days')}
                        </div>
                      </div>

                      {/* Content - flex to fill, aligned */}
                      <div className="flex-1 flex flex-col p-6 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-shrink-0">
                          {description}
                        </p>

                        {includes.length > 0 && (
                          <div className="mb-4 flex-shrink-0">
                            <h4 className="text-xs font-medium text-foreground/80 mb-2">
                              {t('packages.includes')}
                            </h4>
                            <ul className="grid grid-cols-1 gap-1.5">
                              {includes.slice(0, 4).map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                  <span className="truncate">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Price & CTA - always at bottom */}
                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="text-xs text-muted-foreground block">
                              {t('common.startingFrom')}
                            </span>
                            <span className="text-xl font-bold text-primary">
                              {pkg.currency} {pkg.price?.toLocaleString()}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 px-4 py-2 rounded-md text-sm font-medium",
                              "bg-primary text-primary-foreground",
                              "group-hover:bg-primary/90 transition-colors"
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

          {filteredPackages.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">
                {locale === 'ar'
                  ? 'لا توجد باقات تطابق البحث'
                  : 'No packages match your search'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Button variant="outline" onClick={goBack}>
                  {t('packages.backToCategories')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter('all')
                    setSearch('')
                  }}
                >
                  {locale === 'ar' ? 'مسح البحث' : 'Clear filters'}
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
