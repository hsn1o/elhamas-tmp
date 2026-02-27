'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { LocationImageUpload } from '@/components/admin/LocationImageUpload'

type RoomRow = {
  id: string
  hotelId: string
  nameEn: string
  nameAr: string
  descriptionEn: string | null
  descriptionAr: string | null
  pricePerNight: number
  currency: string
  maxGuests: number
  amenities: string[]
  amenitiesAr: string[]
  imageUrl: string | null
  isActive: boolean
}

export function HotelRoomsSection({ hotelId }: { hotelId: string }) {
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<RoomRow | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    pricePerNight: '',
    currency: 'SAR',
    maxGuests: 2,
    amenities: [] as string[],
    amenitiesAr: [] as string[],
    imageUrl: '',
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchRooms() {
    try {
      const res = await fetch(`/api/admin/hotels/${hotelId}/rooms`)
      if (res.ok) {
        const data = await res.json()
        setRooms(data)
      }
    } catch {
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [hotelId])

  function openAdd() {
    setEditingRoom(null)
    setForm({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      pricePerNight: '',
      currency: 'SAR',
      maxGuests: 2,
      amenities: [],
      amenitiesAr: [],
      imageUrl: '',
    })
    setError('')
    setDialogOpen(true)
  }

  function openEdit(room: RoomRow) {
    setEditingRoom(room)
    setForm({
      nameEn: room.nameEn,
      nameAr: room.nameAr,
      descriptionEn: room.descriptionEn ?? '',
      descriptionAr: room.descriptionAr ?? '',
      pricePerNight: String(room.pricePerNight),
      currency: room.currency,
      maxGuests: room.maxGuests,
      amenities: room.amenities ?? [],
      amenitiesAr: room.amenitiesAr ?? [],
      imageUrl: room.imageUrl ?? '',
    })
    setError('')
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      setError('Name (EN) and Name (AR) are required')
      return
    }
    setSubmitLoading(true)
    try {
      if (editingRoom) {
        const res = await fetch(`/api/admin/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim(),
            descriptionEn: form.descriptionEn.trim() || null,
            descriptionAr: form.descriptionAr.trim() || null,
            pricePerNight: parseFloat(form.pricePerNight) || 0,
            currency: form.currency,
            maxGuests: Number(form.maxGuests) || 1,
            amenities: form.amenities.filter(Boolean),
            amenitiesAr: form.amenitiesAr.filter(Boolean),
            imageUrl: form.imageUrl.trim() || null,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'Failed to update room')
          return
        }
      } else {
        const res = await fetch(`/api/admin/hotels/${hotelId}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim(),
            descriptionEn: form.descriptionEn.trim() || null,
            descriptionAr: form.descriptionAr.trim() || null,
            pricePerNight: parseFloat(form.pricePerNight) || 0,
            currency: form.currency,
            maxGuests: Number(form.maxGuests) || 1,
            amenities: form.amenities.filter(Boolean),
            amenitiesAr: form.amenitiesAr.filter(Boolean),
            imageUrl: form.imageUrl.trim() || null,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'Failed to create room')
          return
        }
      }
      setDialogOpen(false)
      fetchRooms()
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteId(null)
        fetchRooms()
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rooms</h2>
      <p className="text-sm text-muted-foreground">
        Add and manage rooms for this hotel. Each room has one image, name, description, price, and amenities.
      </p>
      <Button onClick={openAdd} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add room
      </Button>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No rooms yet. Add one above.
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price/night</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    {room.imageUrl ? (
                      <a
                        href={room.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative w-14 h-14 rounded-md overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={room.imageUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </a>
                    ) : (
                      <div className="w-14 h-14 rounded-md border border-dashed border-muted-foreground/40 bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{room.nameEn}</p>
                    <p className="text-xs text-muted-foreground" dir="rtl">{room.nameAr}</p>
                  </TableCell>
                  <TableCell>
                    {room.currency} {room.pricePerNight}
                  </TableCell>
                  <TableCell>{room.maxGuests}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(room)} title="Edit room">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(room.id)} title="Delete room">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? 'Edit room' : 'Add room'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name (EN) *</Label>
                <Input
                  value={form.nameEn}
                  onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                  placeholder="e.g. Deluxe Double"
                />
              </div>
              <div className="space-y-2">
                <Label>Name (AR) *</Label>
                <Input
                  value={form.nameAr}
                  onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                  placeholder="غرفة ديلوكس مزدوجة"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (EN)</Label>
              <Textarea
                value={form.descriptionEn}
                onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                rows={2}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (AR)</Label>
              <Textarea
                value={form.descriptionAr}
                onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
                rows={2}
                dir="rtl"
                placeholder="اختياري"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Price per night *</Label>
                <Input
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
                />
              </div>
              <div className="space-y-2">
                <Label>Max guests</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxGuests}
                  onChange={(e) => setForm((f) => ({ ...f, maxGuests: Number(e.target.value) || 1 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image (optional)</Label>
              <LocationImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
            </div>
            <div className="space-y-2">
              <Label>Room Amenities (EN + AR)</Label>
              <div className="space-y-2">
                {(() => {
                  const len = Math.max(form.amenities.length, form.amenitiesAr.length, 1)
                  const en = form.amenities.length ? form.amenities : ['']
                  const ar = form.amenitiesAr.length ? form.amenitiesAr : ['']
                  const padEn = [...en, ...Array(len - en.length).fill('')].slice(0, len)
                  const padAr = [...ar, ...Array(len - ar.length).fill('')].slice(0, len)
                  return padEn.map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={padEn[i] ?? ''}
                        onChange={(e) => {
                          const next = [...padEn]
                          next[i] = e.target.value
                          setForm((f) => ({ ...f, amenities: next }))
                        }}
                        placeholder="e.g. Wifi (EN)"
                        className="flex-1"
                      />
                      <Input
                        value={padAr[i] ?? ''}
                        onChange={(e) => {
                          const next = [...padAr]
                          next[i] = e.target.value
                          setForm((f) => ({ ...f, amenitiesAr: next }))
                        }}
                        placeholder="واي فاي (AR)"
                        dir="rtl"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const nextEn = padEn.filter((_, j) => j !== i)
                          const nextAr = padAr.filter((_, j) => j !== i)
                          setForm((f) => ({
                            ...f,
                            amenities: nextEn.length ? nextEn : [''],
                            amenitiesAr: nextAr.length ? nextAr : [''],
                          }))
                        }}
                        className="shrink-0 text-destructive hover:text-destructive"
                        title="Remove amenity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                })()}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      amenities: [...(f.amenities.length ? f.amenities : ['']), ''],
                      amenitiesAr: [...(f.amenitiesAr.length ? f.amenitiesAr : ['']), ''],
                    }))
                  }
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingRoom ? 'Update room' : 'Add room'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete room?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
