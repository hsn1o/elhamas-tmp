'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownField } from '@/components/admin/MarkdownField'
import { FeaturedImageUpload } from '@/components/admin/HotelImageUploads'

type EventRow = {
  id: string
  titleEn: string
  titleAr: string
  slug: string
  descriptionEn?: string | null
  descriptionAr?: string | null
  shortDescriptionEn?: string | null
  shortDescriptionAr?: string | null
  eventDate: string
  endDate?: string | null
  frequencyEn?: string | null
  frequencyAr?: string | null
  locationEn?: string | null
  locationAr?: string | null
  imageUrl?: string | null
  price?: number | string | null
  currency: string
  maxAttendees?: number | string | null
  isFeatured: boolean
  isActive: boolean
}

const defaultValues = {
  titleEn: '',
  titleAr: '',
  slug: '',
  descriptionEn: '',
  descriptionAr: '',
  shortDescriptionEn: '',
  shortDescriptionAr: '',
  eventDate: new Date().toISOString().slice(0, 16),
  endDate: '',
  frequencyEn: '',
  frequencyAr: '',
  locationEn: '',
  locationAr: '',
  imageUrl: '',
  price: '' as string | number,
  currency: 'SAR',
  maxAttendees: '' as string | number,
  isFeatured: false,
  isActive: true,
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function EventForm({
  event: evt,
  onSuccess,
  onCancel,
}: {
  event?: EventRow | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(evt?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (evt) {
      setForm({
        titleEn: evt.titleEn ?? '',
        titleAr: evt.titleAr ?? '',
        slug: evt.slug ?? '',
        descriptionEn: evt.descriptionEn ?? '',
        descriptionAr: evt.descriptionAr ?? '',
        shortDescriptionEn: evt.shortDescriptionEn ?? '',
        shortDescriptionAr: evt.shortDescriptionAr ?? '',
        eventDate: evt.eventDate ? new Date(evt.eventDate).toISOString().slice(0, 16) : defaultValues.eventDate,
        endDate: evt.endDate ? new Date(evt.endDate).toISOString().slice(0, 16) : '',
        frequencyEn: evt.frequencyEn ?? '',
        frequencyAr: evt.frequencyAr ?? '',
        locationEn: evt.locationEn ?? '',
        locationAr: evt.locationAr ?? '',
        imageUrl: evt.imageUrl ?? '',
        price: evt.price != null ? evt.price : '',
        currency: evt.currency ?? 'SAR',
        maxAttendees: evt.maxAttendees != null ? evt.maxAttendees : '',
        isFeatured: evt.isFeatured ?? false,
        isActive: evt.isActive !== false,
      })
    } else {
      setForm(defaultValues)
    }
  }, [evt])

  const deriveSlug = () => {
    const s = form.titleEn.trim()
    if (!s) return
    setForm((f) => ({ ...f, slug: slugify(s) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.titleEn.trim() || !form.titleAr.trim()) {
      setError('Title (English) and Title (Arabic) are required')
      return
    }
    const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.titleEn)
    if (!slug) {
      setError('Slug is required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        titleEn: form.titleEn.trim(),
        titleAr: form.titleAr.trim(),
        slug,
        descriptionEn: form.descriptionEn.trim() || null,
        descriptionAr: form.descriptionAr.trim() || null,
        shortDescriptionEn: form.shortDescriptionEn.trim() || null,
        shortDescriptionAr: form.shortDescriptionAr.trim() || null,
        eventDate: form.eventDate ? new Date(form.eventDate) : new Date(),
        endDate: form.endDate ? new Date(form.endDate) : null,
        frequencyEn: form.frequencyEn.trim() || null,
        frequencyAr: form.frequencyAr.trim() || null,
        locationEn: form.locationEn.trim() || null,
        locationAr: form.locationAr.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        gallery: [],
        price: form.price === '' ? null : Number(form.price) ?? null,
        currency: form.currency || 'SAR',
        maxAttendees: form.maxAttendees === '' ? null : Number(form.maxAttendees) ?? null,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      }
      const url = isEdit ? `/api/admin/events/${evt!.id}` : '/api/admin/events'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Request failed')
        return
      }
      router.refresh()
      onSuccess()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="shortDesc">Short desc</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="date">Date & frequency</TabsTrigger>
          <TabsTrigger value="price">Price & info</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (English) *</Label>
              <Input id="titleEn" value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} required placeholder="e.g. House of Islamic Arts" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">Title (Arabic) *</Label>
              <Input id="titleAr" value={form.titleAr} onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))} required placeholder="بيت الفنون الإسلامية" dir="rtl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="house-of-islamic-arts" className="font-mono" />
              <Button type="button" variant="outline" onClick={deriveSlug}>From title</Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locationEn">Location (English)</Label>
              <Input id="locationEn" value={form.locationEn} onChange={(e) => setForm((f) => ({ ...f, locationEn: e.target.value }))} placeholder="e.g. Jeddah" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationAr">Location (Arabic)</Label>
              <Input id="locationAr" value={form.locationAr} onChange={(e) => setForm((f) => ({ ...f, locationAr: e.target.value }))} placeholder="جدة" dir="rtl" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shortDesc" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="shortDescriptionEn">Short description (English)</Label>
            <Textarea id="shortDescriptionEn" value={form.shortDescriptionEn} onChange={(e) => setForm((f) => ({ ...f, shortDescriptionEn: e.target.value }))} rows={3} placeholder="Brief summary for cards." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescriptionAr">Short description (Arabic)</Label>
            <Textarea id="shortDescriptionAr" value={form.shortDescriptionAr} onChange={(e) => setForm((f) => ({ ...f, shortDescriptionAr: e.target.value }))} rows={3} placeholder="ملخص قصير للبطاقات." dir="rtl" />
          </div>
        </TabsContent>

        <TabsContent value="description" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Description (English) - Markdown</Label>
            <MarkdownField id="descriptionEn" label="" value={form.descriptionEn} onChange={(v) => setForm((f) => ({ ...f, descriptionEn: v }))} height={280} />
          </div>
          <div className="space-y-2">
            <Label>Description (Arabic) - Markdown</Label>
            <MarkdownField id="descriptionAr" label="" value={form.descriptionAr} onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))} dir="rtl" height={280} />
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-sm font-medium text-foreground mb-2">Featured image</p>
            <p className="text-xs text-muted-foreground mb-4">Shown on the event card and detail page.</p>
            <FeaturedImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          </div>
        </TabsContent>

        <TabsContent value="date" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event date *</Label>
              <Input id="eventDate" type="datetime-local" value={form.eventDate} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" type="datetime-local" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="frequencyEn">Frequency / schedule (English)</Label>
              <Input id="frequencyEn" value={form.frequencyEn} onChange={(e) => setForm((f) => ({ ...f, frequencyEn: e.target.value }))} placeholder="e.g. Daily" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencyAr">Frequency / schedule (Arabic)</Label>
              <Input id="frequencyAr" value={form.frequencyAr} onChange={(e) => setForm((f) => ({ ...f, frequencyAr: e.target.value }))} placeholder="يومي" dir="rtl" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="price" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} placeholder="SAR" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Max attendees</Label>
            <Input id="maxAttendees" type="number" min={0} value={form.maxAttendees} onChange={(e) => setForm((f) => ({ ...f, maxAttendees: e.target.value }))} placeholder="Leave empty for unlimited" />
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4 mt-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-xs text-muted-foreground">When on, the event is visible on the public events page.</p>
            </div>
            <Switch id="isActive" checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label htmlFor="isFeatured">Featured</Label>
              <p className="text-xs text-muted-foreground">Show as featured on listings.</p>
            </div>
            <Switch id="isFeatured" checked={form.isFeatured} onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : isEdit ? 'Update event' : 'Create event'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
