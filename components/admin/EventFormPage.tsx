'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventForm } from './EventForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

type EventRow = {
  id: string
  titleEn: string
  titleAr: string
  slug: string
  descriptionEn?: string | null
  descriptionAr?: string | null
  shortDescriptionEn?: string | null
  shortDescriptionAr?: string | null
  eventDate: string
  endDate?: string | null
  frequencyEn?: string | null
  frequencyAr?: string | null
  locationEn?: string | null
  locationAr?: string | null
  imageUrl?: string | null
  price?: number | string | null
  currency: string
  maxAttendees?: number | string | null
  isFeatured: boolean
  isActive: boolean
}

export function EventFormPage({ mode, eventId }: { mode: 'create' | 'edit'; eventId?: string }) {
  const router = useRouter()
  const [item, setItem] = useState<EventRow | null | undefined>(undefined)
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode === 'edit' && eventId) {
      setLoading(true)
      fetch(`/api/admin/events/${eventId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setItem(data))
        .catch(() => setItem(null))
        .finally(() => setLoading(false))
    } else {
      setItem(null)
    }
  }, [mode, eventId])

  function handleSuccess() {
    router.push('/admin/events')
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
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to events
          </Button>
        </Link>
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/events">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to events
        </Button>
      </Link>
      <EventForm
        event={mode === 'edit' && item ? item : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
