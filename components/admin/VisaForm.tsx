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
import { Plus, Trash2 } from 'lucide-react'
import { FeaturedImageUpload } from '@/components/admin/HotelImageUploads'

type VisaRow = {
  id: string
  nameEn: string
  nameAr: string
  visaTypeEn: string
  visaTypeAr?: string | null
  processingTimeEn?: string | null
  processingTimeAr?: string | null
  validityEn?: string | null
  validityAr?: string | null
  descriptionEn?: string | null
  descriptionAr?: string | null
  price?: number | string | null
  currency: string
  imageUrl?: string | null
  gallery?: string[]
  requirementsEn?: string[]
  requirementsAr?: string[]
  includesEn?: string[]
  includesAr?: string[]
  excludesEn?: string[]
  excludesAr?: string[]
  eligibilityEn?: string | null
  eligibilityAr?: string | null
  notesEn?: string | null
  notesAr?: string | null
  isFeatured: boolean
  isActive: boolean
}

const defaultValues = {
  nameEn: '',
  nameAr: '',
  visaTypeEn: 'Umrah',
  visaTypeAr: '',
  processingTimeEn: '',
  processingTimeAr: '',
  validityEn: '',
  validityAr: '',
  descriptionEn: '',
  descriptionAr: '',
  price: '' as string | number,
  currency: 'SAR',
  imageUrl: '',
  gallery: [] as string[],
  requirementsEn: [] as string[],
  requirementsAr: [] as string[],
  includesEn: [] as string[],
  includesAr: [] as string[],
  excludesEn: [] as string[],
  excludesAr: [] as string[],
  eligibilityEn: '',
  eligibilityAr: '',
  notesEn: '',
  notesAr: '',
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
            <Button type="button" variant="outline" size="icon" onClick={() => remove(i)}>
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

export function VisaForm({
  visa,
  onSuccess,
  onCancel,
}: {
  visa?: VisaRow | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(visa?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (visa) {
      setForm({
        nameEn: visa.nameEn ?? '',
        nameAr: visa.nameAr ?? '',
        visaTypeEn: visa.visaTypeEn ?? 'Umrah',
        visaTypeAr: visa.visaTypeAr ?? '',
        processingTimeEn: visa.processingTimeEn ?? '',
        processingTimeAr: visa.processingTimeAr ?? '',
        validityEn: visa.validityEn ?? '',
        validityAr: visa.validityAr ?? '',
        descriptionEn: visa.descriptionEn ?? '',
        descriptionAr: visa.descriptionAr ?? '',
        price: visa.price != null ? visa.price : '',
        currency: visa.currency ?? 'SAR',
        imageUrl: visa.imageUrl ?? '',
        gallery: visa.gallery?.length ? visa.gallery : [],
        requirementsEn: visa.requirementsEn?.length ? visa.requirementsEn : [],
        requirementsAr: visa.requirementsAr?.length ? visa.requirementsAr : [],
        includesEn: visa.includesEn?.length ? visa.includesEn : [],
        includesAr: visa.includesAr?.length ? visa.includesAr : [],
        excludesEn: visa.excludesEn?.length ? visa.excludesEn : [],
        excludesAr: visa.excludesAr?.length ? visa.excludesAr : [],
        eligibilityEn: visa.eligibilityEn ?? '',
        eligibilityAr: visa.eligibilityAr ?? '',
        notesEn: visa.notesEn ?? '',
        notesAr: visa.notesAr ?? '',
        isFeatured: visa.isFeatured ?? false,
        isActive: visa.isActive !== false,
      })
    } else {
      setForm(defaultValues)
    }
  }, [visa])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      setError('Name (EN) and Name (AR) are required')
      return
    }
    if (!form.visaTypeEn.trim()) {
      setError('Visa type (EN) is required')
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
        visaTypeEn: form.visaTypeEn.trim(),
        visaTypeAr: form.visaTypeAr.trim() || null,
        processingTimeEn: form.processingTimeEn.trim() || null,
        processingTimeAr: form.processingTimeAr.trim() || null,
        validityEn: form.validityEn.trim() || null,
        validityAr: form.validityAr.trim() || null,
        descriptionEn: form.descriptionEn.trim() || null,
        descriptionAr: form.descriptionAr.trim() || null,
        price: form.price === '' ? null : parseFloat(String(form.price)) ?? null,
        currency: form.currency || 'SAR',
        imageUrl: form.imageUrl.trim() || null,
        gallery: [],
        requirementsEn: form.requirementsEn.filter(Boolean),
        requirementsAr: form.requirementsAr.filter(Boolean),
        includesEn: form.includesEn.filter(Boolean),
        includesAr: form.includesAr.filter(Boolean),
        excludesEn: form.excludesEn.filter(Boolean),
        excludesAr: form.excludesAr.filter(Boolean),
        eligibilityEn: form.eligibilityEn.trim() || null,
        eligibilityAr: form.eligibilityAr.trim() || null,
        notesEn: form.notesEn.trim() || null,
        notesAr: form.notesAr.trim() || null,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      }
      const url = isEdit ? `/api/admin/visas/${visa!.id}` : '/api/admin/visas'
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="includes">Includes</TabsTrigger>
          <TabsTrigger value="excludes">Excludes</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
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
                placeholder="e.g. Umrah Visa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Name (Arabic) *</Label>
              <Input
                id="nameAr"
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                required
                placeholder="تأشيرة العمرة"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visaTypeEn">Visa type (English) *</Label>
              <Input
                id="visaTypeEn"
                value={form.visaTypeEn}
                onChange={(e) => setForm((f) => ({ ...f, visaTypeEn: e.target.value }))}
                placeholder="e.g. Umrah, Hajj, Tourist"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visaTypeAr">Visa type (Arabic)</Label>
              <Input
                id="visaTypeAr"
                value={form.visaTypeAr}
                onChange={(e) => setForm((f) => ({ ...f, visaTypeAr: e.target.value }))}
                placeholder="عمرة، حج، سياحية"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="processingTimeEn">Processing time (EN)</Label>
              <Input
                id="processingTimeEn"
                value={form.processingTimeEn}
                onChange={(e) => setForm((f) => ({ ...f, processingTimeEn: e.target.value }))}
                placeholder="e.g. 5–7 working days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processingTimeAr">Processing time (AR)</Label>
              <Input
                id="processingTimeAr"
                value={form.processingTimeAr}
                onChange={(e) => setForm((f) => ({ ...f, processingTimeAr: e.target.value }))}
                placeholder="5–7 أيام عمل"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="validityEn">Validity / duration (EN)</Label>
              <Input
                id="validityEn"
                value={form.validityEn}
                onChange={(e) => setForm((f) => ({ ...f, validityEn: e.target.value }))}
                placeholder="e.g. 90 days, single entry"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validityAr">Validity / duration (AR)</Label>
              <Input
                id="validityAr"
                value={form.validityAr}
                onChange={(e) => setForm((f) => ({ ...f, validityAr: e.target.value }))}
                placeholder="90 يوماً"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
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
            placeholder="Process, steps, what the customer gets (Markdown)"
            dir="ltr"
            height={280}
          />
          <MarkdownField
            id="descriptionAr"
            label="Description (Arabic)"
            value={form.descriptionAr}
            onChange={(v) => setForm((f) => ({ ...f, descriptionAr: v }))}
            placeholder="الوصف (ماركداون)"
            dir="rtl"
            height={280}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-sm font-medium text-foreground mb-4">Featured image</p>
            <p className="text-xs text-muted-foreground mb-4">
              One image for this visa. It appears on the list and at the top of the detail page.
            </p>
            <FeaturedImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4 mt-4">
          <PairField
            itemsEn={form.requirementsEn.length ? form.requirementsEn : ['']}
            itemsAr={form.requirementsAr.length ? form.requirementsAr : ['']}
            onChange={(en, ar) => setForm((f) => ({ ...f, requirementsEn: en, requirementsAr: ar }))}
            label="Required documents (EN + AR)"
            placeholderEn="e.g. Passport copy"
            placeholderAr="صورة جواز السفر"
          />
        </TabsContent>

        <TabsContent value="includes" className="space-y-4 mt-4">
          <PairField
            itemsEn={form.includesEn.length ? form.includesEn : ['']}
            itemsAr={form.includesAr.length ? form.includesAr : ['']}
            onChange={(en, ar) => setForm((f) => ({ ...f, includesEn: en, includesAr: ar }))}
            label="What's included (EN + AR)"
            placeholderEn="e.g. Application submission"
            placeholderAr="تقديم الطلب"
          />
        </TabsContent>

        <TabsContent value="excludes" className="space-y-4 mt-4">
          <PairField
            itemsEn={form.excludesEn.length ? form.excludesEn : ['']}
            itemsAr={form.excludesAr.length ? form.excludesAr : ['']}
            onChange={(en, ar) => setForm((f) => ({ ...f, excludesEn: en, excludesAr: ar }))}
            label="What's excluded (EN + AR)"
            placeholderEn="e.g. Consulate fees"
            placeholderAr="رسوم القنصلية"
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eligibilityEn">Eligibility (EN)</Label>
              <Input
                id="eligibilityEn"
                value={form.eligibilityEn}
                onChange={(e) => setForm((f) => ({ ...f, eligibilityEn: e.target.value }))}
                placeholder="e.g. All nationalities"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibilityAr">Eligibility (AR)</Label>
              <Input
                id="eligibilityAr"
                value={form.eligibilityAr}
                onChange={(e) => setForm((f) => ({ ...f, eligibilityAr: e.target.value }))}
                placeholder="جميع الجنسيات"
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notesEn">Notes / conditions (EN)</Label>
            <Textarea
              id="notesEn"
              value={form.notesEn}
              onChange={(e) => setForm((f) => ({ ...f, notesEn: e.target.value }))}
              rows={3}
              placeholder="e.g. Prices subject to consulate changes"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notesAr">Notes / conditions (AR)</Label>
            <Textarea
              id="notesAr"
              value={form.notesAr}
              onChange={(e) => setForm((f) => ({ ...f, notesAr: e.target.value }))}
              rows={3}
              placeholder="الملاحظات"
              dir="rtl"
            />
          </div>
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
          {loading ? 'Saving…' : isEdit ? 'Update visa' : 'Create visa'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
