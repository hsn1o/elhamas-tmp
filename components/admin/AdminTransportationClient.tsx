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

type TransportationRow = {
  id: string
  nameEn: string
  nameAr: string
  vehicleType: string
  capacity: number
  locationEn?: string | null
  locationAr?: string | null
  pricePerTrip?: number | string | null
  pricePerDay?: number | string | null
  currency: string
  isFeatured: boolean
  isActive: boolean
}

export function AdminTransportationClient() {
  const router = useRouter()
  const [items, setItems] = useState<TransportationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function fetchItems() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/transportation')
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
      const res = await fetch(`/api/admin/transportation/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteId(null)
        fetchItems()
        router.refresh()
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const price = (row: TransportationRow) => {
    const p = row.pricePerTrip != null ? row.pricePerTrip : row.pricePerDay
    if (p == null || p === '') return '—'
    return `${p} ${row.currency}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transportation</h1>
          <p className="text-muted-foreground">
            Manage vehicles and transportation services.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/transportation/new">
            <Plus className="h-4 w-4 mr-2" />
            Add transportation
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p className="mb-4">No transportation entries yet.</p>
          <Button variant="outline" asChild>
            <Link href="/admin/transportation/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first entry
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Vehicle type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{row.nameEn}</p>
                  </TableCell>
                  <TableCell>{row.vehicleType}</TableCell>
                  <TableCell>{row.locationEn ?? '—'}</TableCell>
                  <TableCell>{row.capacity} seats</TableCell>
                  <TableCell>{price(row)}</TableCell>
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
                        <Link href={`/admin/transportation/${row.id}/edit`}>
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
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transportation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The entry will be permanently removed.
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
