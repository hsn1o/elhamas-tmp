'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react'
import { LocationImageUpload } from '@/components/admin/LocationImageUpload'

type CategoryRow = {
  id: string
  nameEn: string
  nameAr: string
  sortOrder: number
  imageUrl?: string | null
}

export function CategoriesPageClient() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [nameEn, setNameEn] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editNameEn, setEditNameEn] = useState('')
  const [editNameAr, setEditNameAr] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [discoverTitleEn, setDiscoverTitleEn] = useState('Discover Saudi Arabia')
  const [discoverTitleAr, setDiscoverTitleAr] = useState('اكتشف السعودية')
  const [discoverImageUrl, setDiscoverImageUrl] = useState('')
  const [discoverVisible, setDiscoverVisible] = useState(true)
  const [discoverSaving, setDiscoverSaving] = useState(false)
  const [discoverLoading, setDiscoverLoading] = useState(true)

  async function fetchDiscoverCard() {
    setDiscoverLoading(true)
    try {
      const res = await fetch('/api/admin/package-discover-card')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setDiscoverTitleEn(data.titleEn ?? 'Discover Saudi Arabia')
          setDiscoverTitleAr(data.titleAr ?? 'اكتشف السعودية')
          setDiscoverImageUrl(data.imageUrl ?? '')
          setDiscoverVisible(data.isVisible !== false)
        }
      }
    } catch {
      // keep defaults
    } finally {
      setDiscoverLoading(false)
    }
  }

  async function handleSaveDiscoverCard(e: React.FormEvent) {
    e.preventDefault()
    setDiscoverSaving(true)
    try {
      const res = await fetch('/api/admin/package-discover-card', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titleEn: discoverTitleEn.trim(),
          titleAr: discoverTitleAr.trim(),
          imageUrl: discoverImageUrl.trim() || null,
          isVisible: discoverVisible,
        }),
      })
      if (res.ok) {
        await fetchDiscoverCard()
      }
    } finally {
      setDiscoverSaving(false)
    }
  }

  async function fetchCategories() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchDiscoverCard()
  }, [])

  function openEdit(cat: CategoryRow) {
    setEditId(cat.id)
    setEditNameEn(cat.nameEn)
    setEditNameAr(cat.nameAr)
    setEditImageUrl(cat.imageUrl ?? '')
  }

  function closeEdit() {
    setEditId(null)
    setEditNameEn('')
    setEditNameAr('')
    setEditImageUrl('')
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nameEn.trim() || !nameAr.trim()) {
      setError('Both names are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim(),
          imageUrl: imageUrl.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to create category')
        return
      }
      setNameEn('')
      setNameAr('')
      setImageUrl('')
      fetchCategories()
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate() {
    if (!editId) return
    if (!editNameEn.trim() || !editNameAr.trim()) return
    setEditSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${editId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nameEn: editNameEn.trim(),
          nameAr: editNameAr.trim(),
          imageUrl: editImageUrl.trim() || null,
        }),
      })
      if (res.ok) {
        closeEdit()
        fetchCategories()
      }
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeleteId(null)
        fetchCategories()
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Package Categories</h1>
        <p className="text-muted-foreground">
          Create categories and assign packages to them. Category images appear on the public packages page.
        </p>
      </div>

      <form
        onSubmit={handleSaveDiscoverCard}
        className="rounded-lg border p-4 space-y-4 max-w-xl"
      >
        <h2 className="font-medium">Discover Locations Card</h2>
        <p className="text-sm text-muted-foreground">
          Customize the &quot;Discover Locations&quot; card shown on the public packages page. Edit title, replace image, or hide the card.
        </p>
        {discoverLoading ? (
          <div className="flex items-center gap-2 py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading…</span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discoverTitleEn">Title (English)</Label>
                <Input
                  id="discoverTitleEn"
                  value={discoverTitleEn}
                  onChange={(e) => setDiscoverTitleEn(e.target.value)}
                  placeholder="e.g. Discover Saudi Arabia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discoverTitleAr">Title (Arabic)</Label>
                <Input
                  id="discoverTitleAr"
                  value={discoverTitleAr}
                  onChange={(e) => setDiscoverTitleAr(e.target.value)}
                  placeholder="اكتشف السعودية"
                  dir="rtl"
                />
              </div>
            </div>
            <LocationImageUpload
              value={discoverImageUrl}
              onChange={setDiscoverImageUrl}
            />
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Show card on packages page</Label>
                <p className="text-sm text-muted-foreground">
                  When hidden, the Discover Locations card will not appear.
                </p>
              </div>
              <Switch
                checked={discoverVisible}
                onCheckedChange={setDiscoverVisible}
              />
            </div>
            <Button type="submit" disabled={discoverSaving}>
              {discoverSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Discover Card
            </Button>
          </>
        )}
      </form>

      <form onSubmit={handleAdd} className="rounded-lg border p-4 space-y-4 max-w-xl">
        <h2 className="font-medium">Add new category</h2>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nameEn">Name (English)</Label>
            <Input
              id="nameEn"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Premium Umrah"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameAr">Name (Arabic)</Label>
            <Input
              id="nameAr"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: عمرة فاخرة"
              dir="rtl"
            />
          </div>
        </div>
        <LocationImageUpload value={imageUrl} onChange={setImageUrl} />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add category
        </Button>
      </form>

      <div>
        <h2 className="font-medium mb-3">Existing categories</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No categories yet. Add one above.
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      {cat.imageUrl ? (
                        <div className="w-14 h-14 rounded border overflow-hidden bg-muted shrink-0">
                          <img
                            src={cat.imageUrl}
                            alt={cat.nameEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{cat.nameEn}</TableCell>
                    <TableCell dir="rtl">{cat.nameAr}</TableCell>
                    <TableCell>{cat.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(cat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editId} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                  placeholder="e.g. Premium Umrah"
                />
              </div>
              <div className="space-y-2">
                <Label>Name (Arabic)</Label>
                <Input
                  value={editNameAr}
                  onChange={(e) => setEditNameAr(e.target.value)}
                  placeholder="مثال: عمرة فاخرة"
                  dir="rtl"
                />
              </div>
            </div>
            <LocationImageUpload value={editImageUrl} onChange={setEditImageUrl} />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeEdit}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={editSaving}>
                {editSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Packages using this category will have no category. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteLoading}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
