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
import { Plus, Loader2 } from 'lucide-react'
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

  async function fetchLocations() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/hotel-locations')
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Places</h1>
        <p className="text-muted-foreground">
          Create places (e.g. Mecca, Medina) and assign hotels to them. Same as categories for packages.
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
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>{loc.nameEn}</TableCell>
                    <TableCell dir="rtl">{loc.nameAr}</TableCell>
                    <TableCell>{loc.sortOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
