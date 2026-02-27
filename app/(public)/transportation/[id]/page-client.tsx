'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Check, MapPin, Car, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Transportation } from '@/lib/db'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TransportationDetailClientProps {
  item: Transportation
}

export function TransportationDetailClient({ item }: TransportationDetailClientProps) {
  const { t, locale, isRTL } = useI18n()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [todayIso, setTodayIso] = useState<string | undefined>()

  useEffect(() => {
    const now = new Date()
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    setTodayIso(localMidnight.toISOString().slice(0, 10))
  }, [])

  const images = item.images?.length
    ? item.images
    : ['/images/package-default.jpg']

  const goToSlide = (index: number) => {
    setSelectedIndex(((index % images.length) + images.length) % images.length)
  }

  const name = getLocalizedContent(
    item as unknown as Record<string, unknown>,
    'name',
    locale,
  )
  const description = getLocalizedContent(
    item as unknown as Record<string, unknown>,
    'description',
    locale,
  )
  const location = locale === 'ar' ? (item.location_ar || item.location_en) : (item.location_en || item.location_ar)
  const features = locale === 'ar'
    ? (item.features_ar?.length ? item.features_ar : item.features)
    : (item.features?.length ? item.features : item.features_ar)
  const excludes = locale === 'ar'
    ? (item.excludes_ar?.length ? item.excludes_ar : item.excludes)
    : (item.excludes?.length ? item.excludes : item.excludes_ar)

  const sectionCard = 'rounded-xl border border-border bg-card p-6 md:p-8'

  const displayPrice = item.price_per_trip ?? item.price_per_day
  const priceNum = displayPrice != null ? Number(displayPrice) : null

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const countryCode = (formData.get('countryCode')?.toString() ?? '').trim()
    const phone = (formData.get('phone')?.toString() ?? '').trim()
    const fullPhone =
      countryCode || phone ? [countryCode, phone].filter(Boolean).join(' ') : undefined
    const destination = formData.get('destination')?.toString() ?? ''
    const dateOfBooking = formData.get('dateOfBooking')?.toString() ?? ''
    const payload = {
      type: 'transportation',
      referenceId: item.id,
      referenceName: name,
      referenceSummary:
        item.price_per_trip != null
          ? `${item.currency} ${Number(item.price_per_trip).toLocaleString()} ${t('transport.perTrip')}`
          : item.price_per_day != null
            ? `${item.currency} ${Number(item.price_per_day).toLocaleString()} ${t('transport.perDay')}`
            : undefined,
      meta: {
        destination,
        dateOfBooking,
        capacity: item.capacity,
        vehicleType: locale === 'ar' ? item.vehicle_type_ar || item.vehicle_type : item.vehicle_type || item.vehicle_type_ar,
      },
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      nationality: formData.get('nationality')?.toString() ?? '',
      phone: fullPhone,
      message: destination || dateOfBooking
        ? `Destination: ${destination || '—'}, Date of booking: ${dateOfBooking || '—'}`
        : 'Transportation booking request',
      locale,
    }
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitted(true)
      form.reset()
    } catch (err) {
      console.error(err)
      setError(
        locale === 'ar'
          ? 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero: vehicle name only (like hotel: name + rating) */}
      <section className="relative min-h-[320px] md:min-h-[380px] flex flex-col justify-center overflow-hidden pt-24">
        <Image
          src={images[0]}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-primary/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {name}
          </h1>
        </div>
      </section>

      {/* Info bar: location, capacity, price (like hotel’s floating card) */}
      <div className="relative z-20 -mt-6 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div
            className={cn(
              'rounded-2xl bg-white border border-border shadow-lg px-6 py-4',
              'flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8 text-sm',
              locale === 'ar' && 'md:flex-row-reverse',
            )}
          >
            {location && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {location}
              </span>
            )}
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Car className="w-4 h-4 text-primary shrink-0" />
              {item.capacity} {t('transport.seats')}
            </span>
            {priceNum != null && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Banknote className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">
                  {t('common.startingFrom')}
                </span>
                <span className="font-bold text-primary">
                  {item.currency} {priceNum.toLocaleString()}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/transportation"
            className={cn(
              'inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors',
              locale === 'ar' && 'flex-row-reverse',
            )}
          >
            <ChevronLeft
              className={cn('w-4 h-4 shrink-0', locale === 'ar' && 'rotate-180')}
            />
            {locale === 'ar' ? 'العودة لخدمات النقل' : 'Back to Transportation'}
          </Link>

          <div className="space-y-8">
            {/* Image gallery */}
            <div className={cn(sectionCard, 'overflow-hidden p-0')}>
              <div className="relative w-full">
                <div className="relative w-full aspect-[21/14] min-h-[200px] bg-muted overflow-hidden rounded-t-xl">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className={cn(
                        'absolute inset-0 transition-opacity duration-300',
                        selectedIndex === i
                          ? 'opacity-100 z-0'
                          : 'opacity-0 z-[-1] pointer-events-none',
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-lg bg-white/90 text-foreground hover:bg-white flex items-center justify-center shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(selectedIndex + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-lg bg-white/90 text-foreground hover:bg-white flex items-center justify-center shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
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
                          'relative shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer',
                          selectedIndex === i
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent opacity-70 hover:opacity-100',
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
              </div>
            </div>

            {/* Overview */}
            <div className={sectionCard}>
              <h2 className="text-xl font-semibold text-primary mb-4">
                {t('transport.overview')}
              </h2>
              {description && (
                <div
                  className="text-muted-foreground space-y-4 mb-6"
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
                      p: ({ children }) => (
                        <p className="mb-3 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="marker:text-primary">{children}</li>
                      ),
                    }}
                  >
                    {description}
                  </ReactMarkdown>
                </div>
              )}
              {(item.vehicle_type || item.vehicle_type_ar) && (
                <p className="text-foreground mb-2">
                  <span className="text-muted-foreground">
                    {locale === 'ar' ? 'نوع المركبة:' : 'Vehicle type:'}{' '}
                  </span>
                  <span className="font-medium">
                    {locale === 'ar' ? (item.vehicle_type_ar || item.vehicle_type) : (item.vehicle_type || item.vehicle_type_ar)}
                  </span>
                </p>
              )}
              <div className="space-y-2">
                {item.price_per_trip != null && (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">
                      {locale === 'ar' ? 'سعر الرحلة:' : 'Transportation price:'}{' '}
                    </span>
                    <span className="font-semibold text-primary">
                      {item.currency} {Number(item.price_per_trip).toLocaleString()}
                    </span>
                  </p>
                )}
                {item.price_per_day != null && (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">
                      {locale === 'ar' ? 'سعر اليوم:' : 'Full day price:'}{' '}
                    </span>
                    <span className="font-semibold text-primary">
                      {item.currency} {Number(item.price_per_day).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Offer includes / Offer excludes */}
            <div className={cn(sectionCard, 'grid grid-cols-1 md:grid-cols-2 gap-8')}>
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">
                  {t('transport.offerIncludes')}
                </h2>
                {features?.length ? (
                  <ul className="space-y-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    {features.map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ar' ? '—' : '—'}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">
                  {t('transport.offerExcludes')}
                </h2>
                {excludes?.length ? (
                  <ul className="space-y-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    {excludes.map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          —
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ar' ? '—' : '—'}
                  </p>
                )}
              </div>
            </div>

            {/* Inquiry form – same card/label/input/button style as visa & room booking */}
            <div className="rounded-2xl border border-border/60 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {locale === 'ar' ? 'الحجز والاستفسارات' : 'Booking & Inquiries'}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {locale === 'ar'
                  ? 'أدخل بياناتك لإرسال طلب الحجز أو الاستفسار عن هذه المركبة.'
                  : 'Enter your details to send a booking request or inquiry for this vehicle.'}
              </p>
              <form
                onSubmit={handleInquirySubmit}
                className={cn('space-y-4', isRTL && 'text-right')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trans-name" className="text-foreground">
                      {t('contact.form.name')}
                    </Label>
                    <Input
                      id="trans-name"
                      name="name"
                      required
                      placeholder={t('contact.form.name')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trans-email" className="text-foreground">
                      {t('contact.form.email')}
                    </Label>
                    <Input
                      id="trans-email"
                      name="email"
                      type="email"
                      required
                      placeholder={t('contact.form.email')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trans-phone" className="text-foreground">
                    {t('inquiry.form.phone')}
                  </Label>
                  <div
                    className={cn(
                      'flex flex-col gap-3 sm:flex-row',
                      isRTL && 'sm:flex-row-reverse',
                    )}
                  >
                    <Input
                      id="trans-countryCode"
                      name="countryCode"
                      type="tel"
                      placeholder="+966"
                      className="w-full sm:w-28"
                      dir="ltr"
                    />
                    <Input
                      id="trans-phone"
                      name="phone"
                      type="tel"
                      placeholder={t('inquiry.form.phone')}
                      className="flex-1"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trans-nationality" className="text-foreground">
                      {t('inquiry.form.nationality')}
                    </Label>
                    <Input
                      id="trans-nationality"
                      name="nationality"
                      placeholder={t('inquiry.form.nationality')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trans-destination" className="text-foreground">
                      {t('inquiry.form.destination')}
                    </Label>
                    <Input
                      id="trans-destination"
                      name="destination"
                      placeholder={t('inquiry.form.destination')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trans-dateOfBooking" className="text-foreground">
                    {t('inquiry.form.dateOfBooking')}
                  </Label>
                  <Input
                    id="trans-dateOfBooking"
                    name="dateOfBooking"
                    type="date"
                    min={todayIso}
                    dir="ltr"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                {submitted && !error && (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {locale === 'ar' ? 'شكراً! تم إرسال طلبك.' : 'Thank you! Your request has been sent.'}
                  </p>
                )}
                <div className={cn('pt-2', isRTL && 'text-right')}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[180px]"
                  >
                    {loading
                      ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                      : t('inquiry.form.send')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
