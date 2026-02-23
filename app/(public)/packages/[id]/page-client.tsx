'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Check, X, MapPin, ChevronLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PackageDetailHeader } from '@/components/package-detail-header'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { TourPackage } from '@/lib/db'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface PackageDetailClientProps {
  package: TourPackage
}

export function PackageDetailClient({ package: pkg }: PackageDetailClientProps) {
  const { t, locale } = useI18n()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const images = pkg.images?.length
    ? pkg.images
    : ['/images/package-default.jpg']

  const goToSlide = (index: number) => {
    setSelectedIndex(((index % images.length) + images.length) % images.length)
  }

  const p = pkg as unknown as Record<string, unknown>
  const name = getLocalizedContent(p, 'name', locale)
  const shortDesc = getLocalizedContent(p, 'short_description', locale)
  const fullDesc = getLocalizedContent(p, 'description', locale)
  const inclusions = locale === 'ar' ? (pkg.inclusions_ar || pkg.includes) : pkg.includes
  const exclusions = locale === 'ar' ? pkg.exclusions_ar : pkg.exclusions_en

  const sectionCard = 'rounded-xl border border-border bg-card p-6 md:p-8'

  return (
    <>
      <PackageDetailHeader
        title={name}
        subtitle={shortDesc || undefined}
        backgroundImage={images[0]}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            {locale === 'ar' ? 'العودة للباقات' : 'Back to Packages'}
          </Link>

          <div className="space-y-8">
            {/* Hero + Carousel gallery + Price bar */}
            <div className={cn(sectionCard, "overflow-hidden p-0")}>
              <div className="relative w-full">
                <div className="relative w-full aspect-[21/14] min-h-[200px] bg-muted overflow-hidden rounded-3xl">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-300",
                        selectedIndex === i ? "opacity-100 z-0" : "opacity-0 z-[-1] pointer-events-none"
                      )}
                    >
                      <Image
                        src={src}
                        alt={`${name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 896px"
                        priority={i <= 1}
                      />
                    </div>
                  ))}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToSlide(selectedIndex - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(selectedIndex + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronLeft className="h-5 w-5 rotate-180" />
                    </button>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      className={
                        pkg.package_type === 'hajj'
                          ? 'bg-primary text-primary-foreground border-0'
                          : 'bg-secondary text-secondary-foreground border-0'
                      }
                    >
                      {pkg.package_type === 'hajj' ? t('packages.hajj') : t('packages.umrah')}
                    </Badge>
                    <span className="flex items-center gap-2 text-white/90 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {pkg.duration_days} {t('common.days')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {pkg.currency} {pkg.price?.toLocaleString()}
                    </span>
                    <span className="block text-sm text-white/80">{t('common.perPerson')}</span>
                  </div>
                </div>
              </div>
              {images.length > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-center gap-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => goToSlide(i)}
                      onKeyDown={(e) => e.key === 'Enter' && goToSlide(i)}
                      className={cn(
                        "relative shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer",
                        selectedIndex === i
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">{name}</h2>
                  {shortDesc && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      {shortDesc}
                    </p>
                  )}
                </div>
                <Button asChild size="lg" className="min-w-[180px] shrink-0">
                  <Link href={`/contact?package=${pkg.id}`}>{t('common.bookNow')}</Link>
                </Button>
              </div>
            </div>

            {/* Main content grid - Description + Sidebar (Inclusions/Exclusions) */}
            <div className={cn(
              "grid gap-8",
              fullDesc ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {/* Description - takes 2 cols on lg when present */}
              {fullDesc && (
                <div className={cn(sectionCard, "lg:col-span-2")}>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {t('packages.fullDescription')}
                  </h2>
                  <div
                    className="text-muted-foreground space-y-4"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-semibold text-foreground mt-6 mb-2 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold text-foreground mt-5 mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="marker:text-primary">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            className="text-primary underline hover:no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {fullDesc}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Sidebar - Inclusions & Exclusions (side-by-side when no description) */}
              <div className={cn(
                fullDesc ? "space-y-6" : "grid grid-cols-1 sm:grid-cols-2 gap-6"
              )}>
                {inclusions?.length > 0 && (
                  <div className={sectionCard}>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      {t('packages.includes')}
                    </h2>
                    <ul className="space-y-2.5">
                      {inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exclusions?.length > 0 && (
                  <div className={sectionCard}>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-muted-foreground shrink-0" />
                      {t('packages.exclusions')}
                    </h2>
                    <ul className="space-y-2.5">
                      {exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary - full width */}
            {pkg.itinerary?.length > 0 && (
              <div className={sectionCard}>
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary shrink-0" />
                  {t('packages.itinerary')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.itinerary
                    .slice()
                    .sort((a, b) => a.day - b.day)
                    .map((item) => {
                      const title = locale === 'ar' ? item.title_ar : item.title_en
                      return (
                        <div
                          key={item.day}
                          className="flex gap-4 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                            {item.day}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs text-muted-foreground">
                              {t('packages.day')} {item.day}
                            </span>
                            <p className="font-medium text-foreground">{title}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Bottom CTA - full width bar */}
            <div
              className={cn(
                sectionCard,
                "flex flex-col sm:flex-row items-center justify-between gap-6",
                "bg-primary/5 border-primary/20"
              )}
            >
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold text-foreground">{name}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {pkg.currency} {pkg.price?.toLocaleString()} {t('common.perPerson')} •{' '}
                  {pkg.duration_days} {t('common.days')}
                </p>
              </div>
              <Button asChild size="lg" className="min-w-[180px] shrink-0">
                <Link href={`/contact?package=${pkg.id}`}>{t('common.bookNow')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
