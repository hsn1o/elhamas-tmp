'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TransportationForm } from './TransportationForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

type TransportationRow = {
  id: string
  nameEn: string
  nameAr: string
  vehicleType: string
  vehicleTypeAr?: string | null
  capacity: number
  locationEn?: string | null
  locationAr?: string | null
  descriptionEn?: string | null
  descriptionAr?: string | null
  pricePerTrip?: number | string | null
  pricePerDay?: number | string | null
  currency: string
  imageUrl?: string | null
  gallery?: string[]
  featuresEn?: string[]
  featuresAr?: string[]
  excludesEn?: string[]
  excludesAr?: string[]
  isFeatured: boolean
  isActive: boolean
}

export function TransportationFormPage({
  mode,
  transportationId,
}: {
  mode: 'create' | 'edit'
  transportationId?: string
}) {
  const router = useRouter()
  const [item, setItem] = useState<TransportationRow | null | undefined>(undefined)
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode === 'edit' && transportationId) {
      setLoading(true)
      fetch(`/api/admin/transportation/${transportationId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setItem(data))
        .catch(() => setItem(null))
        .finally(() => setLoading(false))
    } else {
      setItem(null)
    }
  }, [mode, transportationId])

  function handleSuccess() {
    router.push('/admin/transportation')
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

  if (mode === 'edit' && !loading && !item) {
    return (
      <div className="space-y-6">
        <Link href="/admin/transportation">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to transportation
          </Button>
        </Link>
        <p className="text-muted-foreground">Transportation not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/transportation">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to transportation
        </Button>
      </Link>
      <TransportationForm
        transportation={mode === 'edit' && item ? item : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
