'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

type HotelRow = {
  id: string
  nameEn: string
  nameAr: string
  city: string
  starRating: number
  pricePerNight: number | null
  currency: string
  isFeatured: boolean
  isActive: boolean
  location?: { nameEn: string; nameAr: string } | null
  _count?: { rooms: number }
}

export function AdminHotelsClient() {
  const router = useRouter()
  const [hotels, setHotels] = useState<HotelRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function fetchHotels() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/hotels')
      if (res.ok) {
        const data = await res.json()
        setHotels(data)
      }
    } catch {
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  async function handleDelete(id: string) {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/hotels/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteId(null)
        fetchHotels()
        router.refresh()
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hotels</h1>
          <p className="text-muted-foreground">
            Create and manage hotels. Add rooms when editing a hotel.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/hotels/new">
            <Plus className="h-4 w-4 mr-2" />
            Add hotel
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : hotels.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p className="mb-4">No hotels yet.</p>
          <Button variant="outline" asChild>
            <Link href="/admin/hotels/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first hotel
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stars</TableHead>
                <TableHead>Price/night</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    <p className="font-medium">{h.nameEn}</p>
                  </TableCell>
                  <TableCell>{h.location?.nameEn ?? '—'}</TableCell>
                  <TableCell>{h.city}</TableCell>
                  <TableCell>{h.starRating} ★</TableCell>
                  <TableCell>
                    {h.pricePerNight != null ? `${h.pricePerNight} ${h.currency}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="h-auto p-0" asChild>
                      <Link href={`/admin/hotels/${h.id}/edit#rooms`}>
                        {h._count?.rooms ?? 0} room{(h._count?.rooms ?? 0) !== 1 ? 's' : ''} →
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {h.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      {!h.isActive && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild title="Edit hotel">
                        <Link href={`/admin/hotels/${h.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(h.id)}
                        title="Delete hotel"
                      >
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete hotel?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The hotel and its rooms will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteLoading}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
