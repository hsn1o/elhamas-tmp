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

type EventRow = {
  id: string
  titleEn: string
  titleAr: string
  slug: string
  locationEn?: string | null
  locationAr?: string | null
  frequencyEn?: string | null
  frequencyAr?: string | null
  eventDate: string
  price?: number | string | null
  currency: string
  isActive: boolean
  isFeatured: boolean
}

function formatDate(s: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export function AdminEventsClient() {
  const router = useRouter()
  const [items, setItems] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function fetchItems() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/events')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  async function handleDelete(id: string) {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteId(null)
        fetchItems()
        router.refresh()
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const priceStr = (row: EventRow) => {
    if (row.price == null || row.price === '') return '—'
    return `${row.price} ${row.currency}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-muted-foreground">
            Manage events (title, location, date, price).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Add event
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p className="mb-4">No events yet.</p>
          <Button variant="outline" asChild>
            <Link href="/admin/events/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date / Frequency</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{row.titleEn}</p>
                  </TableCell>
                  <TableCell>{row.locationEn ?? row.locationAr ?? '—'}</TableCell>
                  <TableCell>
                    {row.frequencyEn ?? row.frequencyAr ?? formatDate(row.eventDate)}
                  </TableCell>
                  <TableCell>{priceStr(row)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {row.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      {!row.isActive && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild title="Edit">
                        <Link href={`/admin/events/${row.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(row.id)}
                        title="Delete"
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
          <AlertDialogTitle>Delete event?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteLoading}
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
