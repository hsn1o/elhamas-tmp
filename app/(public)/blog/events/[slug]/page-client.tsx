'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, Calendar, MapPin, Banknote, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Event } from '@/lib/db'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface EventDetailClientProps {
  event: Event
}

function formatDate(d: Date | null): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateRange(start: Date, end: Date | null): string {
  const s = formatDate(start)
  if (!end) return s
  const e = formatDate(end)
  if (s === e) return s
  return `${s} – ${e}`
}

export function EventDetailClient({ event: evt }: EventDetailClientProps) {
  const { t, locale, isRTL } = useI18n()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = getLocalizedContent(
    evt as unknown as Record<string, unknown>,
    'title',
    locale
  )
  const location = getLocalizedContent(
    evt as unknown as Record<string, unknown>,
    'location',
    locale
  )
  const frequency = getLocalizedContent(
    evt as unknown as Record<string, unknown>,
    'frequency',
    locale
  )
  const description = getLocalizedContent(
    evt as unknown as Record<string, unknown>,
    'description',
    locale
  )
  const dateDisplay = frequency || formatDateRange(evt.event_date, evt.end_date)
  const img = evt.featured_image || '/images/package-default.jpg'
  const priceStr = evt.price != null ? `${evt.price} ${evt.currency}` : null
  const audienceDisplay = evt.max_attendees == null || evt.max_attendees <= 0
    ? t('events.all')
    : String(evt.max_attendees)

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
    const attendees = formData.get('attendees')?.toString() ?? ''
    const payload = {
      type: 'event',
      referenceId: evt.id,
      referenceName: title,
      referenceSummary: dateDisplay + (location ? ` • ${location}` : ''),
      meta: {
        eventDate: dateDisplay,
        location: location || undefined,
        maxAttendees: evt.max_attendees,
        attendees,
        price: evt.price,
        currency: evt.currency,
      },
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      nationality: formData.get('nationality')?.toString() ?? '',
      phone: fullPhone,
      message: formData.get('message')?.toString()?.trim() || 'Event registration / inquiry',
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
      {/* Hero */}
      <section className="relative min-h-[320px] md:min-h-[380px] flex flex-col justify-end overflow-hidden pt-24">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
        <div className="relative z-10 container mx-auto px-4 pb-10">
          <Link href="/blog/events" className="inline-block mb-6">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className={cn('h-4 w-4', locale === 'ar' && 'rotate-180')} />
              {t('events.backToEvents')}
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg max-w-4xl" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {title}
          </h1>
        </div>
      </section>

      {/* Main + sidebar */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-8', locale === 'ar' && 'lg:grid-flow-dense')}>
          {/* Overview card - left, spans 2 cols on lg */}
          <div className={cn('lg:col-span-2', locale === 'ar' && 'lg:col-start-2')}>
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
              <div className="bg-primary px-6 py-3">
                <h2 className="text-lg font-semibold text-white">{t('events.overview')}</h2>
              </div>
              <div className="p-6 md:p-8">
                <div
                  className={cn(
                    'prose prose-lg max-w-none dark:prose-invert',
                    'prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-primary',
                    locale === 'ar' && 'prose-body:rtl'
                  )}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {description || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - right on lg */}
          <div className={cn('space-y-4', locale === 'ar' && 'lg:col-start-1 lg:row-start-1')}>
            {/* Event Date card */}
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
              <div className="bg-primary px-6 py-3">
                <h3 className="text-sm font-semibold text-white">{t('events.eventDate')}</h3>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground font-medium" dir={locale === 'ar' ? 'rtl' : 'ltr'}>{dateDisplay}</span>
              </div>
            </div>

            {/* Price card */}
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
              <div className="bg-primary px-6 py-3">
                <h3 className="text-sm font-semibold text-white">{t('events.price')}</h3>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Banknote className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">
                  {priceStr
                    ? `${t('events.fromPrice')} ${priceStr} / ${t('events.perPerson')}`
                    : '—'}
                </span>
              </div>
            </div>

            {/* Information card */}
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
              <div className="bg-primary px-6 py-3">
                <h3 className="text-sm font-semibold text-white">{t('events.information')}</h3>
              </div>
              <div className="p-4 space-y-3">
                {location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground" dir={locale === 'ar' ? 'rtl' : 'ltr'}>{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground">{t('events.audience')}: {audienceDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking & Inquiries form – full width, unified design */}
        <div className="mt-12 rounded-2xl border border-border/60 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-foreground mb-2">
            {locale === 'ar' ? 'الحجز والاستفسارات' : 'Booking & Inquiries'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {locale === 'ar'
              ? 'أدخل بياناتك للتسجيل أو الاستفسار عن هذه الفعالية.'
              : 'Enter your details to register or inquire about this event.'}
          </p>
          <form
            onSubmit={handleInquirySubmit}
            className={cn('space-y-4', isRTL && 'text-right')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evt-name" className="text-foreground">
                  {t('contact.form.name')}
                </Label>
                <Input
                  id="evt-name"
                  name="name"
                  required
                  placeholder={t('contact.form.name')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evt-email" className="text-foreground">
                  {t('contact.form.email')}
                </Label>
                <Input
                  id="evt-email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('contact.form.email')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="evt-phone" className="text-foreground">
                {t('inquiry.form.phone')}
              </Label>
              <div
                className={cn(
                  'flex flex-col gap-3 sm:flex-row',
                  isRTL && 'sm:flex-row-reverse',
                )}
              >
                <Input
                  id="evt-countryCode"
                  name="countryCode"
                  type="tel"
                  placeholder="+966"
                  className="w-full sm:w-28"
                  dir="ltr"
                />
                <Input
                  id="evt-phone"
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
                <Label htmlFor="evt-nationality" className="text-foreground">
                  {t('inquiry.form.nationality')}
                </Label>
                <Input
                  id="evt-nationality"
                  name="nationality"
                  placeholder={t('inquiry.form.nationality')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evt-attendees" className="text-foreground">
                  {locale === 'ar' ? 'عدد الحضور (اختياري)' : 'Number of attendees (optional)'}
                </Label>
                <Input
                  id="evt-attendees"
                  name="attendees"
                  type="number"
                  min={1}
                  placeholder={locale === 'ar' ? 'مثال: 2' : 'e.g. 2'}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="evt-message" className="text-foreground">
                {t('contact.form.message')}
              </Label>
              <Textarea
                id="evt-message"
                name="message"
                rows={3}
                placeholder={t('contact.form.message')}
                dir={isRTL ? 'rtl' : 'ltr'}
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
    </>
  )
}
