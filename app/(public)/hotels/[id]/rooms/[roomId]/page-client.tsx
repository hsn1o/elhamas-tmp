'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  Star,
  Check,
  Bed,
  Wifi,
  Snowflake,
  Tv,
  Refrigerator,
  User,
} from 'lucide-react'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Hotel, Room } from '@/lib/db'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

function amenityIcon(amenity: string) {
  const a = amenity.toLowerCase()
  if (a.includes('wifi') || a.includes('wi-fi')) return Wifi
  if (a.includes('air') || a.includes('ac') || a.includes('conditioning'))
    return Snowflake
  if (a.includes('tv') || a.includes('television')) return Tv
  if (
    a.includes('fridge') ||
    a.includes('minibar') ||
    a.includes('refrigerator')
  )
    return Refrigerator
  if (a.includes('bed') || a.includes('beds')) return Bed
  return Check
}

interface RoomBookingPageClientProps {
  hotel: Hotel
  room: Room
}

export function RoomBookingPageClient({ hotel, room }: RoomBookingPageClientProps) {
  const { t, locale, isRTL } = useI18n()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [todayIso, setTodayIso] = useState<string | undefined>()

  useEffect(() => {
    const now = new Date()
    const localMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )
    setTodayIso(localMidnight.toISOString().slice(0, 10))
  }, [])

  const hotelName = getLocalizedContent(
    hotel as unknown as Record<string, unknown>,
    'name',
    locale,
  )
  const roomName = getLocalizedContent(
    room as unknown as Record<string, unknown>,
    'name',
    locale,
  )
  const roomDescription = getLocalizedContent(
    room as unknown as Record<string, unknown>,
    'description',
    locale,
  )
  const heroImage =
    room.image_url ||
    (hotel.images?.length ? hotel.images[0] : '/images/package-default.jpg')
  const amenitiesEn = room.amenities ?? []
  const amenitiesAr = room.amenities_ar ?? []
  const amenities = amenitiesEn
    .map((_, i) =>
      locale === 'ar' && amenitiesAr[i] ? amenitiesAr[i] : amenitiesEn[i],
    )
    .filter(Boolean)
  const fitsLabel =
    room.max_guests === 1
      ? (locale === 'ar' ? 'لشخص واحد' : 'Fits 1 person')
      : locale === 'ar'
        ? `لـ ${room.max_guests} أشخاص`
        : `Fits ${room.max_guests} persons`

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const checkIn = formData.get('checkIn')?.toString() ?? ''
    const checkOut = formData.get('checkOut')?.toString() ?? ''
    const adults = formData.get('adults')?.toString() ?? ''
    const children = formData.get('children')?.toString() ?? ''
    const countryCode = (formData.get('countryCode')?.toString() ?? '').trim()
    const phone = (formData.get('phone')?.toString() ?? '').trim()
    const fullPhone =
      countryCode || phone ? [countryCode, phone].filter(Boolean).join(' ') : undefined
  const needVisa = formData.get('needVisa')?.toString() ?? ''
  const bookedFlight = formData.get('bookedFlight')?.toString() ?? ''
  const needTransport = formData.get('needTransport')?.toString() ?? ''

    const payload = {
      type: 'hotel_room',
      referenceId: room.id,
      referenceName: roomName,
      referenceSummary: `${hotelName} • ${roomName}`,
      meta: {
        hotelName,
        roomName,
        pricePerNight: room.price_per_night,
        currency: room.currency,
        maxGuests: room.max_guests,
        checkIn,
        checkOut,
        adults,
        children,
        needVisa,
        bookedFlight,
        needTransport,
      },
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      nationality: formData.get('nationality')?.toString() ?? '',
      phone: fullPhone,
      travelers: adults,
      message: formData.get('message')?.toString() ?? '',
      locale,
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      setSubmitted(true)
      form.reset()
    } catch (err) {
      console.error(err)
      setError(
        locale === 'ar'
          ? 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى لاحقاً.'
          : 'Something went wrong while sending your request. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero: room name + hotel name */}
      <section className="relative min-h-[280px] md:min-h-[340px] flex flex-col justify-center overflow-hidden pt-24">
        <Image
          src={heroImage}
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
          <p className="text-white/90 text-sm sm:text-base mb-1 drop-shadow-md">
            {hotelName}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            {roomName}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              {hotel.star_rating} {t('hotels.starRating')}
            </span>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <div className="relative z-20 -mt-6 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div
            className={cn(
              'rounded-2xl bg-white border border-border shadow-lg px-6 py-4 flex flex-wrap items-center justify-center md:justify-between gap-4 md:gap-6 text-sm',
              isRTL && 'md:flex-row-reverse',
            )}
          >
            <span className="font-semibold text-foreground">{roomName}</span>
            <span className="text-muted-foreground">
              {room.currency} {room.price_per_night.toLocaleString()}{' '}
              {t('common.perNight')}
            </span>
            <span className="flex items-center gap-2 text-foreground">
              <User className="w-4 h-4 text-primary shrink-0" />
              {fitsLabel}
            </span>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div
            className={cn(
              'mb-6 flex items-center justify-between gap-3 text-sm text-muted-foreground',
              isRTL && 'flex-row-reverse text-right',
            )}
          >
            <Link
              href={`/hotels/${hotel.id}`}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ChevronLeft
                className={cn('w-4 h-4 shrink-0', isRTL && 'rotate-180')}
              />
              {locale === 'ar' ? 'العودة للفندق' : 'Back to hotel'}
            </Link>
            <span className="text-xs uppercase tracking-wide font-medium">
              {locale === 'ar' ? 'حجز غرفة' : 'Room booking'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Left: room details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="relative w-full aspect-[4/3] bg-muted">
                  {room.image_url ? (
                    <Image
                      src={room.image_url}
                      alt={roomName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(135deg, #751f27 0%, #4a1c20 100%)',
                      }}
                    />
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {roomName}
                  </h2>
                  {roomDescription && (
                    <p
                      className="text-sm text-muted-foreground leading-relaxed mb-4"
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {roomDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-foreground mb-4">
                    <span className="text-lg font-bold text-primary">
                      {room.currency} {room.price_per_night.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {t('common.perNight')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    {fitsLabel}
                  </div>
                </div>
              </div>
              {amenities.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    {t('hotels.amenities')}
                  </h3>
                  <ul
                    className="space-y-2"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {amenities.map((a, i) => {
                      const Icon = amenityIcon(a)
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <Icon className="w-4 h-4 text-primary shrink-0" />
                          <span>{a}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: booking form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border/60 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {locale === 'ar' ? 'الحجز والاستفسارات' : 'Booking & Inquiries'}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {locale === 'ar'
                    ? 'اختر التواريخ وأدخل بياناتك لإرسال طلب الحجز لهذه الغرفة.'
                    : 'Select your dates and enter your details to request a booking for this room.'}
                </p>

                <form
            onSubmit={handleSubmit}
            className={cn('space-y-4', isRTL && 'text-right')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">
                  {locale === 'ar' ? 'تاريخ الوصول' : 'Check-in date'}
                </Label>
                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  required
                  min={todayIso}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">
                  {locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out date'}
                </Label>
                <Input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  required
                  min={todayIso}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults">
                  {locale === 'ar' ? 'عدد البالغين' : 'Adults'}
                </Label>
                <Input
                  id="adults"
                  name="adults"
                  type="number"
                  min={1}
                  defaultValue={room.max_guests || 2}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children">
                  {locale === 'ar' ? 'عدد الاطفال)' : 'Children'}
                </Label>
                <Input
                  id="children"
                  name="children"
                  type="number"
                  min={0}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">
                  {locale === 'ar' ? 'الجنسية' : 'Nationality'}
                </Label>
                <Input
                  id="nationality"
                  name="nationality"
                  placeholder={locale === 'ar' ? 'الجنسية' : 'Nationality'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  {t('contact.form.name')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder={t('contact.form.name')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  {t('contact.form.email')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('contact.form.email')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
              </Label>
              <div
                className={cn(
                  'flex flex-col gap-3 sm:flex-row',
                  isRTL && 'sm:flex-row-reverse',
                )}
              >
                <Input
                  id="countryCode"
                  name="countryCode"
                  type="tel"
                  placeholder="+966"
                  className="w-full sm:w-28"
                  dir="ltr"
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  className="flex-1"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                {locale === 'ar' ? 'ملاحظات خاصة (اختياري)' : 'Special requests (optional)'}
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder={
                  locale === 'ar'
                    ? 'أخبرنا بأي ملاحظات إضافية حول مواعيد الوصول أو نوع الأسرّة وغيرها.'
                    : 'Tell us any additional details such as arrival time or bed preferences.'
                }
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {t('booking.needVisa')} <span className="text-destructive">*</span>
                </p>
                <div
                  className={cn(
                    'flex flex-col gap-2 text-sm text-foreground',
                    isRTL && 'items-end text-right',
                  )}
                >
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="needVisa"
                      value="yes"
                      required
                      className="h-4 w-4 border border-border rounded-full text-primary focus:ring-primary"
                    />
                    <span>{t('booking.yes')}</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="needVisa"
                      value="no"
                      className="h-4 w-4 border border-border rounded-full text-primary focus:ring-primary"
                    />
                    <span>{t('booking.no')}</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {t('booking.bookedFlight')} <span className="text-destructive">*</span>
                </p>
                <div
                  className={cn(
                    'flex flex-col gap-2 text-sm text-foreground',
                    isRTL && 'items-end text-right',
                  )}
                >
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="bookedFlight"
                      value="yes"
                      required
                      className="h-4 w-4 border border-border rounded-full text-primary focus:ring-primary"
                    />
                    <span>{t('booking.yes')}</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="bookedFlight"
                      value="no"
                      className="h-4 w-4 border border-border rounded-full text-primary focus:ring-primary"
                    />
                    <span>{t('booking.no')}</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {t('booking.needTransport')} <span className="text-destructive">*</span>
                </p>
                <div
                  className={cn(
                    'flex flex-col gap-2 text-sm text-foreground',
                    isRTL && 'items-end text-right',
                  )}
                >
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="needTransport"
                      value="yes"
                      required
                      className="h-4 w-4 border border-border rounded-full text-primary focus:ring-primary"
                    />
                    <span>{t('booking.yes')}</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="needTransport"
                      value="no"
                      className="h-4 w-4 border border-border rounded-full text-primary focus:ring-primary"
                    />
                    <span>{t('booking.no')}</span>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {submitted && !error && (
              <p className="text-sm text-green-700 dark:text-green-400">
                {locale === 'ar'
                  ? 'شكراً لك! تم استلام طلب الحجز وسنتواصل معك قريباً.'
                  : 'Thank you! Your booking request has been received and we will contact you soon.'}
              </p>
            )}

            <div className={cn('pt-2', isRTL && 'text-right')}>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[180px]"
              >
                {loading
                  ? locale === 'ar'
                    ? 'جاري الإرسال...'
                    : 'Sending...'
                  : locale === 'ar'
                    ? 'إرسال طلب الحجز'
                    : 'Send booking request'}
              </Button>
            </div>
          </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

