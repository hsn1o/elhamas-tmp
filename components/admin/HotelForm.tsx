'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2 } from 'lucide-react'
import { FeaturedImageUpload, GalleryUpload } from '@/components/admin/HotelImageUploads'
import { LocationImageUpload } from '@/components/admin/LocationImageUpload'
import { cn } from '@/lib/utils'

type HotelRow = {
  id: string
  locationId?: string | null
  nameEn: string
  nameAr: string
  descriptionEn?: string | null
  descriptionAr?: string | null
  locationEn?: string | null
  locationAr?: string | null
  city: string
  cityAr?: string | null
  distanceToHaram?: string | null
  starRating: number
  pricePerNight?: number | null
  currency: string
  imageUrl?: string | null
  gallery?: string[]
  amenities?: string[]
  amenitiesAr?: string[]
  isFeatured: boolean
  isActive: boolean
}

const defaultValues = {
  locationId: '' as string | null,
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  locationEn: '',
  locationAr: '',
  city: 'Mecca',
  cityAr: '',
  distanceToHaram: '',
  starRating: 5,
  pricePerNight: '' as string | number,
  currency: 'SAR',
  imageUrl: '',
  gallery: [] as string[],
  amenities: [] as string[],
  amenitiesAr: [] as string[],
  isFeatured: false,
  isActive: true,
}

function ArrayField({
  items,
  onChange,
  label,
  placeholder,
}: {
  items: string[]
  onChange: (items: string[]) => void
  label: string
  placeholder?: string
}) {
  const effective = items.length ? items : ['']
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {effective.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...effective]
                next[i] = e.target.value
                onChange(next)
              }}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                const next = effective.filter((_, j) => j !== i)
                onChange(next.length ? next : [''])
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
<Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange([...effective, ''])}
      >
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  </div>
)
}

function AmenitiesPairField({
  itemsEn,
  itemsAr,
  onChange,
  label,
}: {
  itemsEn: string[]
  itemsAr: string[]
  onChange: (en: string[], ar: string[]) => void
  label: string
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
              placeholder="e.g. Wifi (EN)"
              className="flex-1"
            />
            <Input
              value={padAr[i]}
              onChange={(e) => update(i, 'ar', e.target.value)}
              placeholder="واي فاي (AR)"
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

export function HotelForm({
  hotel,
  onSuccess,
  onCancel,
}: {
  hotel?: HotelRow | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(hotel?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultValues)
  const [locations, setLocations] = useState<{ id: string; nameEn: string; nameAr: string }[]>([])
  const [locationOpen, setLocationOpen] = useState(false)
  const [newLocEn, setNewLocEn] = useState('')
  const [newLocAr, setNewLocAr] = useState('')
  const [newLocImageUrl, setNewLocImageUrl] = useState('')
  const [createLocationLoading, setCreateLocationLoading] = useState(false)
  const [createLocationError, setCreateLocationError] = useState('')
  const [locationDeleteId, setLocationDeleteId] = useState<string | null>(null)
  const [locationDeleteLoading, setLocationDeleteLoading] = useState(false)
  const [locationSavingId, setLocationSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/hotel-locations')
      .then((r) => (r.ok ? r.json() : []))
      .then(setLocations)
      .catch(() => setLocations([]))
  }, [])

  useEffect(() => {
    if (hotel) {
      setForm({
        locationId: hotel.locationId ?? null,
        nameEn: hotel.nameEn ?? '',
        nameAr: hotel.nameAr ?? '',
        descriptionEn: hotel.descriptionEn ?? '',
        descriptionAr: hotel.descriptionAr ?? '',
        locationEn: hotel.locationEn ?? '',
        locationAr: hotel.locationAr ?? '',
        city: hotel.city ?? 'Mecca',
        cityAr: hotel.cityAr ?? '',
        distanceToHaram: hotel.distanceToHaram ?? '',
        starRating: hotel.starRating ?? 5,
        pricePerNight: hotel.pricePerNight != null ? hotel.pricePerNight : '',
        currency: hotel.currency ?? 'SAR',
        imageUrl: hotel.imageUrl ?? '',
        gallery: hotel.gallery?.length ? hotel.gallery : [],
        amenities: hotel.amenities?.length ? hotel.amenities : [],
        amenitiesAr: hotel.amenitiesAr?.length ? hotel.amenitiesAr : [],
        isFeatured: hotel.isFeatured ?? false,
        isActive: hotel.isActive !== false,
      })
    } else {
      setForm(defaultValues)
    }
  }, [hotel])

  async function handleCreateLocation() {
    if (!newLocEn.trim() || !newLocAr.trim()) return
    setCreateLocationError('')
    setCreateLocationLoading(true)
    try {
      const res = await fetch('/api/admin/hotel-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nameEn: newLocEn.trim(),
          nameAr: newLocAr.trim(),
          imageUrl: newLocImageUrl.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.id) {
        setLocations((prev) => [...prev, data])
        setForm((f) => ({ ...f, locationId: data.id }))
        setNewLocEn('')
        setNewLocAr('')
        setNewLocImageUrl('')
        setLocationOpen(false)
      } else {
        setCreateLocationError(data.error || `Request failed (${res.status})`)
      }
    } catch {
      setCreateLocationError('Network error.')
    } finally {
      setCreateLocationLoading(false)
    }
  }

  async function refetchLocations() {
    try {
      const res = await fetch('/api/admin/hotel-locations')
      if (res.ok) {
        const data = await res.json()
        setLocations(Array.isArray(data) ? data : [])
      }
    } catch {
      // keep current list
    }
  }

  async function handleUpdateLocation(id: string, nameEn: string, nameAr: string) {
    if (!nameEn.trim() || !nameAr.trim()) return
    setLocationSavingId(id)
    try {
      const res = await fetch(`/api/admin/hotel-locations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nameEn: nameEn.trim(), nameAr: nameAr.trim() }),
      })
      if (res.ok) {
        setLocations((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, nameEn: nameEn.trim(), nameAr: nameAr.trim() } : l,
          ),
        )
      }
    } finally {
      setLocationSavingId(null)
    }
  }

  async function handleDeleteLocation(id: string) {
    setLocationDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/hotel-locations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        await refetchLocations()
        if (form.locationId === id) {
          setForm((f) => ({ ...f, locationId: null }))
        }
        setLocationDeleteId(null)
      }
    } finally {
      setLocationDeleteLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      setError('Name (EN) and Name (AR) are required')
      return
    }
    if (!form.imageUrl.trim()) {
      setError('Featured image is required')
      return
    }
    if (!form.gallery.filter(Boolean).length) {
      setError('At least one gallery image is required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        locationId: form.locationId?.trim() || null,
        nameEn: form.nameEn.trim(),
        nameAr: form.nameAr.trim(),
        descriptionEn: form.descriptionEn.trim() || null,
        descriptionAr: form.descriptionAr.trim() || null,
        locationEn: form.locationEn.trim() || null,
        locationAr: form.locationAr.trim() || null,
        city: form.city.trim() || 'Mecca',
        cityAr: form.cityAr.trim() || null,
        distanceToHaram: form.distanceToHaram.trim() || null,
        starRating: Number(form.starRating) || 5,
        pricePerNight: form.pricePerNight === '' ? null : parseFloat(String(form.pricePerNight)) ?? null,
        currency: form.currency,
        imageUrl: form.imageUrl.trim() || null,
        gallery: form.gallery.filter(Boolean),
        amenities: form.amenities.filter(Boolean),
        amenitiesAr: form.amenitiesAr.filter(Boolean),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      }
      const url = isEdit ? `/api/admin/hotels/${hotel!.id}` : '/api/admin/hotels'
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
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Place *</Label>
              <Popover
                open={locationOpen}
                onOpenChange={(open) => {
                  setLocationOpen(open)
                  if (!open) setCreateLocationError('')
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.locationId
                      ? (locations.find((l) => l.id === form.locationId)?.nameEn ?? 'Select place')
                      : 'Select or create place'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[420px]" align="start">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setForm((f) => ({ ...f, locationId: null }))
                        setLocationOpen(false)
                      }}
                    >
                      No place
                    </button>
                    {locations.map((l) => (
                      <div
                        key={l.id}
                        className={cn(
                          'flex items-center gap-2 rounded-md border p-2',
                          form.locationId === l.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-background',
                        )}
                      >
                        <Input
                          placeholder="Name (EN)"
                          value={l.nameEn}
                          onChange={(e) =>
                            setLocations((prev) =>
                              prev.map((x) =>
                                x.id === l.id ? { ...x, nameEn: e.target.value } : x,
                              ),
                            )
                          }
                          onBlur={(e) => {
                            const v = e.target.value.trim()
                            if (v && v !== l.nameEn) {
                              handleUpdateLocation(l.id, v, l.nameAr)
                            }
                          }}
                          className="flex-1 min-w-0 h-8 text-sm"
                        />
                        <Input
                          placeholder="Name (AR)"
                          value={l.nameAr}
                          onChange={(e) =>
                            setLocations((prev) =>
                              prev.map((x) =>
                                x.id === l.id ? { ...x, nameAr: e.target.value } : x,
                              ),
                            )
                          }
                          onBlur={(e) => {
                            const v = e.target.value.trim()
                            if (v && v !== l.nameAr) {
                              handleUpdateLocation(l.id, l.nameEn, v)
                            }
                          }}
                          className="flex-1 min-w-0 h-8 text-sm"
                          dir="rtl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 shrink-0"
                          onClick={() => {
                            setForm((f) => ({ ...f, locationId: l.id }))
                            setLocationOpen(false)
                          }}
                        >
                          Select
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setLocationDeleteId(l.id)}
                          disabled={locationSavingId === l.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Create new place</p>
                      {createLocationError && (
                        <p className="text-xs text-destructive mb-2">{createLocationError}</p>
                      )}
                      <Input
                        placeholder="Name (EN)"
                        value={newLocEn}
                        onChange={(e) => {
                          setNewLocEn(e.target.value)
                          setCreateLocationError('')
                        }}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Name (AR)"
                        value={newLocAr}
                        onChange={(e) => {
                          setNewLocAr(e.target.value)
                          setCreateLocationError('')
                        }}
                        className="mb-2"
                        dir="rtl"
                      />
                      <LocationImageUpload value={newLocImageUrl} onChange={setNewLocImageUrl} />
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newLocEn.trim() || !newLocAr.trim() || createLocationLoading}
                        onClick={handleCreateLocation}
                      >
                        {createLocationLoading ? 'Adding…' : 'Add & select'}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Location (EN)</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="e.g. Alhdayah"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityAr">Location (AR)</Label>
              <Input
                id="cityAr"
                value={form.cityAr}
                onChange={(e) => setForm((f) => ({ ...f, cityAr: e.target.value }))}
                placeholder="e.g. الهداية"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (English) *</Label>
              <Input
                id="nameEn"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                required
                placeholder="Hotel name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Name (Arabic) *</Label>
              <Input
                id="nameAr"
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                required
                placeholder="اسم الفندق"
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="distanceToHaram">Distance to Haram</Label>
            <Input
              id="distanceToHaram"
              value={form.distanceToHaram}
              onChange={(e) => setForm((f) => ({ ...f, distanceToHaram: e.target.value }))}
              placeholder="e.g. 500m"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="starRating">Star rating (1-5)</Label>
              <Input
                id="starRating"
                type="number"
                min={1}
                max={5}
                value={form.starRating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, starRating: Number(e.target.value) || 5 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerNight">Price per night</Label>
              <Input
                id="pricePerNight"
                type="number"
                min={0}
                step="0.01"
                value={form.pricePerNight}
                onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                placeholder="SAR"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="description" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="descriptionEn">Description (EN)</Label>
            <Textarea
              id="descriptionEn"
              value={form.descriptionEn}
              onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
              rows={4}
              placeholder="Full description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionAr">Description (AR)</Label>
            <Textarea
              id="descriptionAr"
              value={form.descriptionAr}
              onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
              rows={4}
              dir="rtl"
              placeholder="الوصف"
            />
          </div>
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

        <TabsContent value="amenities" className="space-y-4 mt-4">
          <AmenitiesPairField
            itemsEn={form.amenities.length ? form.amenities : ['']}
            itemsAr={form.amenitiesAr.length ? form.amenitiesAr : ['']}
            onChange={(en, ar) => setForm((f) => ({ ...f, amenities: en, amenitiesAr: ar }))}
            label="Hotel Amenities (EN + AR)"
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
          {loading ? 'Saving…' : isEdit ? 'Update hotel' : 'Create hotel'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
    <AlertDialog
      open={!!locationDeleteId}
      onOpenChange={(open) => !open && setLocationDeleteId(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete place?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the place. Hotels using it will have no place. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={locationDeleteLoading}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={locationDeleteLoading}
            onClick={() => locationDeleteId && handleDeleteLocation(locationDeleteId)}
          >
            {locationDeleteLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}
