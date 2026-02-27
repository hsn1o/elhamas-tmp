'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HotelForm } from './HotelForm'
import { HotelRoomsSection } from './HotelRoomsSection'
import { ArrowLeft, Loader2 } from 'lucide-react'

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
  distanceToHaram?: string | null
  starRating: number
  pricePerNight?: number | null
  currency: string
  imageUrl?: string | null
  gallery?: string[]
  amenities?: string[]
  isFeatured: boolean
  isActive: boolean
}

export function HotelFormPage({
  mode,
  hotelId,
}: {
  mode: 'create' | 'edit'
  hotelId?: string
}) {
  const router = useRouter()
  const [hotel, setHotel] = useState<HotelRow | null | undefined>(undefined)
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode === 'edit' && hotelId) {
      setLoading(true)
      fetch(`/api/admin/hotels/${hotelId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setHotel(data))
        .catch(() => setHotel(null))
        .finally(() => setLoading(false))
    } else {
      setHotel(null)
    }
  }, [mode, hotelId])

  // Scroll to #rooms when landing with hash
  useEffect(() => {
    if (mode === 'edit' && hotelId && !loading && hotel && typeof window !== 'undefined' && window.location.hash === '#rooms') {
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [mode, hotelId, loading, hotel])

  function handleSuccess() {
    router.push('/admin/hotels')
    router.refresh()
  }

  function handleCancel() {
    router.back()
  }

  if (mode === 'edit' && loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (mode === 'edit' && !loading && !hotel) {
    return (
      <div className="space-y-6">
        <Link href="/admin/hotels">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to hotels
          </Button>
        </Link>
        <p className="text-muted-foreground">Hotel not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/hotels">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to hotels
        </Button>
      </Link>
      <HotelForm
        hotel={mode === 'edit' && hotel ? hotel : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      {mode === 'edit' && hotelId && (
        <div id="rooms">
          <HotelRoomsSection hotelId={hotelId} />
        </div>
      )}
    </div>
  )
}
