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

type BlogPostRow = {
  id: string
  titleEn: string
  titleAr: string
  slug: string
  placeEn?: string | null
  placeAr?: string | null
  excerptEn?: string | null
  excerptAr?: string | null
  contentEn?: string | null
  contentAr?: string | null
  imageUrl?: string | null
  category?: string | null
  tags?: string[]
  isPublished: boolean
  publishedAt: string | null
}

const defaultValues = {
  titleEn: '',
  titleAr: '',
  slug: '',
  placeEn: '',
  placeAr: '',
  excerptEn: '',
  excerptAr: '',
  contentEn: '',
  contentAr: '',
  imageUrl: '',
  category: '',
  tags: [] as string[],
  isPublished: false,
  publishedAt: '',
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function BlogPostForm({
  post,
  onSuccess,
  onCancel,
}: {
  post?: BlogPostRow | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(post?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (post) {
      setForm({
        titleEn: post.titleEn ?? '',
        titleAr: post.titleAr ?? '',
        slug: post.slug ?? '',
        placeEn: post.placeEn ?? '',
        placeAr: post.placeAr ?? '',
        excerptEn: post.excerptEn ?? '',
        excerptAr: post.excerptAr ?? '',
        contentEn: post.contentEn ?? '',
        contentAr: post.contentAr ?? '',
        imageUrl: post.imageUrl ?? '',
        category: post.category ?? '',
        tags: post.tags?.length ? post.tags : [],
        isPublished: post.isPublished ?? false,
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
      })
    } else {
      setForm(defaultValues)
    }
  }, [post])

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
        placeEn: form.placeEn.trim() || null,
        placeAr: form.placeAr.trim() || null,
        excerptEn: form.excerptEn.trim() || null,
        excerptAr: form.excerptAr.trim() || null,
        contentEn: form.contentEn.trim() || null,
        contentAr: form.contentAr.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        category: form.category.trim() || null,
        tags: form.tags.filter(Boolean),
        isPublished: form.isPublished,
        publishedAt: form.isPublished ? (form.publishedAt ? new Date(form.publishedAt) : new Date()) : null,
      }
      const url = isEdit ? `/api/admin/blog/${post!.id}` : '/api/admin/blog'
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="excerpt">Excerpt</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (English) *</Label>
              <Input id="titleEn" value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} required placeholder="e.g. Best time to visit Mecca" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">Title (Arabic) *</Label>
              <Input id="titleAr" value={form.titleAr} onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))} required placeholder="أفضل وقت لزيارة مكة" dir="rtl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="best-time-to-visit-mecca" className="font-mono" />
              <Button type="button" variant="outline" onClick={deriveSlug}>From title</Button>
            </div>
            <p className="text-xs text-muted-foreground">URL path. Leave empty to derive from Title (English).</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="placeEn">Place (English)</Label>
              <Input id="placeEn" value={form.placeEn} onChange={(e) => setForm((f) => ({ ...f, placeEn: e.target.value }))} placeholder="e.g. Mecca, Saudi Arabia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeAr">Place (Arabic)</Label>
              <Input id="placeAr" value={form.placeAr} onChange={(e) => setForm((f) => ({ ...f, placeAr: e.target.value }))} placeholder="مكة المكرمة، السعودية" dir="rtl" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="excerpt" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="excerptEn">Short description (English)</Label>
            <Textarea id="excerptEn" value={form.excerptEn} onChange={(e) => setForm((f) => ({ ...f, excerptEn: e.target.value }))} rows={3} placeholder="Brief summary for cards and meta." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerptAr">Short description (Arabic)</Label>
            <Textarea id="excerptAr" value={form.excerptAr} onChange={(e) => setForm((f) => ({ ...f, excerptAr: e.target.value }))} rows={3} placeholder="ملخص قصير للبطاقات والميتا." dir="rtl" />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Content (English) - Markdown</Label>
            <MarkdownField id="contentEn" label="" value={form.contentEn} onChange={(v) => setForm((f) => ({ ...f, contentEn: v }))} height={280} />
          </div>
          <div className="space-y-2">
            <Label>Content (Arabic) - Markdown</Label>
            <MarkdownField id="contentAr" label="" value={form.contentAr} onChange={(v) => setForm((f) => ({ ...f, contentAr: v }))} dir="rtl" height={280} />
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-sm font-medium text-foreground mb-2">Featured image</p>
            <p className="text-xs text-muted-foreground mb-4">Shown on the article card and at the top of the detail page.</p>
            <FeaturedImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4 mt-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label htmlFor="isPublished">Published</Label>
              <p className="text-xs text-muted-foreground">When on, the article is visible on the public blog.</p>
            </div>
            <Switch id="isPublished" checked={form.isPublished} onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v, publishedAt: v && !f.publishedAt ? new Date().toISOString().slice(0, 16) : f.publishedAt }))} />
          </div>
          {form.isPublished && (
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Publish date and time</Label>
              <Input id="publishedAt" type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Travel tips" />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input value={form.tags.join(', ')} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))} placeholder="travel, umrah, mecca" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : isEdit ? 'Update article' : 'Create article'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
