'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

type HotelLocationRow = {
  id: string
  nameEn: string
  nameAr: string
  sortOrder: number
  imageUrl?: string | null
}

export function HotelLocationsPageClient() {
  const [locations, setLocations] = useState<HotelLocationRow[]>([])
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

  async function fetchLocations() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/hotel-locations', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setLocations(data)
      }
    } catch {
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  function openEdit(loc: HotelLocationRow) {
    setEditId(loc.id)
    setEditNameEn(loc.nameEn)
    setEditNameAr(loc.nameAr)
    setEditImageUrl(loc.imageUrl ?? '')
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
      const res = await fetch('/api/admin/hotel-locations', {
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
        setError(data.error || 'Failed to create place')
        return
      }
      setNameEn('')
      setNameAr('')
      setImageUrl('')
      fetchLocations()
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
      const res = await fetch(`/api/admin/hotel-locations/${editId}`, {
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
        fetchLocations()
      }
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/hotel-locations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeleteId(null)
        fetchLocations()
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Places</h1>
        <p className="text-muted-foreground">
          Create places (e.g. Mecca, Medina) and assign hotels to them. Place images appear on the public hotels page.
        </p>
      </div>

      <form onSubmit={handleAdd} className="rounded-lg border p-4 space-y-4 max-w-xl">
        <h2 className="font-medium">Add new place</h2>
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
              placeholder="e.g. Mecca"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameAr">Name (Arabic)</Label>
            <Input
              id="nameAr"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مكة"
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
          Add place
        </Button>
      </form>

      <div>
        <h2 className="font-medium mb-3">Existing places</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No places yet. Add one above.
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
                {locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>
                      {loc.imageUrl ? (
                        <div className="w-14 h-14 rounded border overflow-hidden bg-muted shrink-0">
                          <img
                            src={loc.imageUrl}
                            alt={loc.nameEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{loc.nameEn}</TableCell>
                    <TableCell dir="rtl">{loc.nameAr}</TableCell>
                    <TableCell>{loc.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(loc)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(loc.id)}
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

      <Dialog open={!!editId} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit place</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                  placeholder="e.g. Mecca"
                />
              </div>
              <div className="space-y-2">
                <Label>Name (Arabic)</Label>
                <Input
                  value={editNameAr}
                  onChange={(e) => setEditNameAr(e.target.value)}
                  placeholder="مكة"
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

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete place?</AlertDialogTitle>
            <AlertDialogDescription>
              Hotels using this place will have no location. This cannot be undone.
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
