'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MarkdownField } from '@/components/admin/MarkdownField'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2 } from 'lucide-react'
import { FeaturedImageUpload, GalleryUpload } from '@/components/admin/HotelImageUploads'

type TransportationRow = {
  id: string
  nameEn: string
  nameAr: string
  vehicleType: string
  vehicleTypeAr?: string | null
  capacity: number
  locationEn?: string | null
  locationAr?: string | null
  descriptionEn?: string | null
  descriptionAr?: string | null
  pricePerTrip?: number | string | null
  pricePerDay?: number | string | null
  currency: string
  imageUrl?: string | null
  gallery?: string[]
  featuresEn?: string[]
  featuresAr?: string[]
  excludesEn?: string[]
  excludesAr?: string[]
  isFeatured: boolean
  isActive: boolean
}

const defaultValues = {
  nameEn: '',
  nameAr: '',
  vehicleType: '',
  vehicleTypeAr: '',
  capacity: 1,
  locationEn: '',
  locationAr: '',
  descriptionEn: '',
  descriptionAr: '',
  pricePerTrip: '' as string | number,
  pricePerDay: '' as string | number,
  currency: 'SAR',
  imageUrl: '',
  gallery: [] as string[],
  featuresEn: [] as string[],
  featuresAr: [] as string[],
  excludesEn: [] as string[],
  excludesAr: [] as string[],
  isFeatured: false,
  isActive: true,
}

function PairField({
  itemsEn,
  itemsAr,
  onChange,
  label,
  placeholderEn,
  placeholderAr,
}: {
  itemsEn: string[]
  itemsAr: string[]
  onChange: (en: string[], ar: string[]) => void
  label: string
  placeholderEn?: string
  placeholderAr?: string
}) {
  const len = Math.max(itemsEn.length, itemsAr.length, 1)
  const en = itemsEn.length ? itemsEn : ['']
  const ar = itemsAr.length ? itemsAr : ['']
  const padEn = [...en, ...Array(len - en.length).fill('')].slice(0, len)
  const padAr = [...ar, ...Array(len - ar.length).fill('')].slice(0, len)

  const update = (i: number, field: 'en' | 'ar', value: string) => {
    if (field === 'en') {
      const next = [...padEn]
      next[i] = value
      onChange(next, padAr)
    } else {
      const next = [...padAr]
      next[i] = value
      onChange(padEn, next)
    }
  }

  const remove = (i: number) => {
    const nextEn = padEn.filter((_, j) => j !== i)
    const nextAr = padAr.filter((_, j) => j !== i)
    onChange(nextEn.length ? nextEn : [''], nextAr.length ? nextAr : [''])
  }

  const add = () => onChange([...padEn, ''], [...padAr, ''])

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {padEn.map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={padEn[i]}
              onChange={(e) => update(i, 'en', e.target.value)}
              placeholder={placeholderEn ?? 'EN'}
              className="flex-1"
            />
            <Input
              value={padAr[i]}
              onChange={(e) => update(i, 'ar', e.target.value)}
              placeholder={placeholderAr ?? 'AR'}
              dir="rtl"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}

export function TransportationForm({
  transportation,
  onSuccess,
  onCancel,
}: {
  transportation?: TransportationRow | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(transportation?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (transportation) {
      setForm({
        nameEn: transportation.nameEn ?? '',
        nameAr: transportation.nameAr ?? '',
        vehicleType: transportation.vehicleType ?? '',
        vehicleTypeAr: transportation.vehicleTypeAr ?? '',
        capacity: transportation.capacity ?? 1,
        locationEn: transportation.locationEn ?? '',
        locationAr: transportation.locationAr ?? '',
        descriptionEn: transportation.descriptionEn ?? '',
        descriptionAr: transportation.descriptionAr ?? '',
        pricePerTrip: transportation.pricePerTrip != null ? transportation.pricePerTrip : '',
        pricePerDay: transportation.pricePerDay != null ? transportation.pricePerDay : '',
        currency: transportation.currency ?? 'SAR',
        imageUrl: transportation.imageUrl ?? '',
        gallery: transportation.gallery?.length ? transportation.gallery : [],
        featuresEn: transportation.featuresEn?.length ? transportation.featuresEn : [],
        featuresAr: transportation.featuresAr?.length ? transportation.featuresAr : [],
        excludesEn: transportation.excludesEn?.length ? transportation.excludesEn : [],
        excludesAr: transportation.excludesAr?.length ? transportation.excludesAr : [],
        isFeatured: transportation.isFeatured ?? false,
        isActive: transportation.isActive !== false,
      })
    } else {
      setForm(defaultValues)
    }
  }, [transportation])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      setError('Name (EN) and Name (AR) are required')
      return
    }
    if (!form.vehicleType.trim()) {
      setError('Vehicle type is required')
      return
    }
    if (!form.imageUrl.trim()) {
      setError('Featured image is required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        nameEn: form.nameEn.trim(),
        nameAr: form.nameAr.trim(),
        vehicleType: form.vehicleType.trim(),
        vehicleTypeAr: form.vehicleTypeAr.trim() || null,
        capacity: Number(form.capacity) || 1,
        locationEn: form.locationEn.trim() || null,
        locationAr: form.locationAr.trim() || null,
        descriptionEn: form.descriptionEn.trim() || null,
        descriptionAr: form.descriptionAr.trim() || null,
        pricePerTrip: form.pricePerTrip === '' ? null : parseFloat(String(form.pricePerTrip)) ?? null,
        pricePerDay: form.pricePerDay === '' ? null : parseFloat(String(form.pricePerDay)) ?? null,
        currency: form.currency || 'SAR',
        imageUrl: form.imageUrl.trim() || null,
        gallery: form.gallery.filter(Boolean),
        featuresEn: form.featuresEn.filter(Boolean),
        featuresAr: form.featuresAr.filter(Boolean),
        excludesEn: form.excludesEn.filter(Boolean),
        excludesAr: form.excludesAr.filter(Boolean),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      }
      const url = isEdit ? `/api/admin/transportation/${transportation!.id}` : '/api/admin/transportation'
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
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="features">Includes</TabsTrigger>
          <TabsTrigger value="excludes">Excludes</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (English) *</Label>
              <Input
                id="nameEn"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                required
                placeholder="e.g. Sedan Car (FORD TAURUS)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Name (Arabic) *</Label>
              <Input
                id="nameAr"
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                required
                placeholder="سيارة سيدان"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle type (English) *</Label>
              <Input
                id="vehicleType"
                value={form.vehicleType}
                onChange={(e) => setForm((f) => ({ ...f, vehicleType: e.target.value }))}
                placeholder="e.g. Sedan, Mini Van"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleTypeAr">Vehicle type (Arabic)</Label>
              <Input
                id="vehicleTypeAr"
                value={form.vehicleTypeAr}
                onChange={(e) => setForm((f) => ({ ...f, vehicleTypeAr: e.target.value }))}
                placeholder="e.g. سيدان، ميني فان"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (seats) *</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) || 1 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationEn">Location (EN)</Label>
              <Input
                id="locationEn"
                value={form.locationEn}
                onChange={(e) => setForm((f) => ({ ...f, locationEn: e.target.value }))}
                placeholder="e.g. Riyadh, Dammam & Khobar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationAr">Location (AR)</Label>
              <Input
                id="locationAr"
                value={form.locationAr}
                onChange={(e) => setForm((f) => ({ ...f, locationAr: e.target.value }))}
                placeholder="الموقع"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="pricePerTrip">Price per trip</Label>
              <Input
                id="pricePerTrip"
                type="text"
                inputMode="decimal"
                value={form.pricePerTrip}
                onChange={(e) => setForm((f) => ({ ...f, pricePerTrip: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per day</Label>
              <Input
                id="pricePerDay"
                type="text"
                inputMode="decimal"
                value={form.pricePerDay}
                onChange={(e) => setForm((f) => ({ ...f, pricePerDay: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                placeholder="SAR"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="description" className="space-y-4 mt-4">
          <MarkdownField
            id="descriptionEn"
            label="Description (English)"
            value={form.descriptionEn}
            onChange={(v) => setForm((f) => ({ ...f, descriptionEn: v }))}
            placeholder="Overview and pricing details (Markdown supported)"
            dir="ltr"
            height={280}
          />
          <MarkdownField
            id="descriptionAr"
            label="Description (Arabic)"
            value={form.descriptionAr}
            onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))}
            placeholder="الوصف (يدعم ماركداون)"
            dir="rtl"
            height={280}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <FeaturedImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          />
          <GalleryUpload
            urls={form.gallery.filter(Boolean)}
            onChange={(urls) => setForm((f) => ({ ...f, gallery: urls }))}
          />
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <PairField
            itemsEn={form.featuresEn.length ? form.featuresEn : ['']}
            itemsAr={form.featuresAr.length ? form.featuresAr : ['']}
            onChange={(en, ar) => setForm((f) => ({ ...f, featuresEn: en, featuresAr: ar }))}
            label="Offer includes (EN + AR)"
            placeholderEn="e.g. Licensed driver"
            placeholderAr="السائق مرخص"
          />
        </TabsContent>

        <TabsContent value="excludes" className="space-y-4 mt-4">
          <PairField
            itemsEn={form.excludesEn.length ? form.excludesEn : ['']}
            itemsAr={form.excludesAr.length ? form.excludesAr : ['']}
            onChange={(en, ar) => setForm((f) => ({ ...f, excludesEn: en, excludesAr: ar }))}
            label="Offer excludes (EN + AR)"
            placeholderEn="e.g. Meals"
            placeholderAr="الوجبات"
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-4 mt-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Featured</Label>
              <p className="text-sm text-muted-foreground">Show on homepage</p>
            </div>
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(c) => setForm((f) => ({ ...f, isFeatured: c }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">Visible to visitors</p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(c) => setForm((f) => ({ ...f, isActive: c }))}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Update transportation' : 'Create transportation'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
