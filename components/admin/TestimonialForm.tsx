'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star } from 'lucide-react'

type TestimonialRow = {
  id: string
  nameEn: string
  nameAr: string | null
  contentEn: string
  contentAr: string | null
  workEn: string | null
  workAr: string | null
  rating: number
  isActive: boolean
}

const defaultValues = {
  nameEn: '',
  nameAr: '',
  contentEn: '',
  contentAr: '',
  workEn: '',
  workAr: '',
  rating: 5,
  isActive: true,
}

export function TestimonialForm({
  testimonial,
  onSuccess,
  onCancel,
}: {
  testimonial: TestimonialRow | null
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const router = useRouter()
  const [form, setForm] = useState(defaultValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (testimonial) {
      setForm({
        nameEn: testimonial.nameEn ?? '',
        nameAr: testimonial.nameAr ?? '',
        contentEn: testimonial.contentEn ?? '',
        contentAr: testimonial.contentAr ?? '',
        workEn: testimonial.workEn ?? '',
        workAr: testimonial.workAr ?? '',
        rating: testimonial.rating ?? 5,
        isActive: testimonial.isActive !== false,
      })
    } else {
      setForm(defaultValues)
    }
  }, [testimonial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.nameEn.trim() || !form.nameAr.trim() || !form.contentEn.trim()) {
      setError('Name (EN), Name (AR), and Comment (EN) are required.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        nameEn: form.nameEn.trim(),
        nameAr: form.nameAr.trim(),
        contentEn: form.contentEn.trim(),
        contentAr: form.contentAr.trim() || form.contentEn.trim(),
        workEn: form.workEn.trim() || null,
        workAr: form.workAr.trim() || null,
        rating: form.rating,
        isActive: form.isActive,
      }
      const url = testimonial
        ? `/api/admin/testimonials/${testimonial.id}`
        : '/api/admin/testimonials'
      const method = testimonial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        onSuccess?.()
        router.push('/admin/testimonials')
        router.refresh()
      } else {
        setError(data.error || `Request failed (${res.status})`)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic (EN + AR)</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name (EN) *</Label>
              <Input
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                placeholder="e.g. Laila Ali"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Name (AR) *</Label>
              <Input
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                placeholder="مثال: ليلى علي"
                dir="rtl"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Comment (EN) *</Label>
            <Textarea
              value={form.contentEn}
              onChange={(e) => setForm((f) => ({ ...f, contentEn: e.target.value }))}
              placeholder="What the client said (English)"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Comment (AR)</Label>
            <Textarea
              value={form.contentAr}
              onChange={(e) => setForm((f) => ({ ...f, contentAr: e.target.value }))}
              placeholder="ما قاله العميل (عربي)"
              rows={4}
              dir="rtl"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Work / Title (EN)</Label>
              <Input
                value={form.workEn}
                onChange={(e) => setForm((f) => ({ ...f, workEn: e.target.value }))}
                placeholder="e.g. Entrepreneur"
              />
            </div>
            <div className="space-y-2">
              <Label>Work / Title (AR)</Label>
              <Input
                value={form.workAr}
                onChange={(e) => setForm((f) => ({ ...f, workAr: e.target.value }))}
                placeholder="مثال: رائد أعمال"
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Rating (1–5)</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  className="p-1 rounded hover:bg-muted"
                >
                  <Star
                    className={`h-8 w-8 ${
                      n <= form.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="status" className="space-y-4 mt-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="isActive">Active (show on site)</Label>
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : testimonial ? 'Update testimonial' : 'Create testimonial'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
