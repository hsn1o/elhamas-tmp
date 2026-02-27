'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TestimonialForm } from './TestimonialForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

type TestimonialRow = {
  id: string
  nameEn: string
  nameAr: string | null
  contentEn: string
  contentAr: string | null
  workEn: string | null
  workAr: string | null
  rating: number
  isActive: boolean
}

export function TestimonialFormPage({
  mode,
  testimonialId,
}: {
  mode: 'create' | 'edit'
  testimonialId?: string
}) {
  const router = useRouter()
  const [item, setItem] = useState<TestimonialRow | null | undefined>(undefined)
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode === 'edit' && testimonialId) {
      setLoading(true)
      fetch(`/api/admin/testimonials/${testimonialId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setItem(data))
        .catch(() => setItem(null))
        .finally(() => setLoading(false))
    } else {
      setItem(null)
    }
  }, [mode, testimonialId])

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

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/admin/testimonials">
          <ArrowLeft className="h-4 w-4" />
          Back to testimonials
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold">
          {mode === 'create' ? 'Add testimonial' : 'Edit testimonial'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'create'
            ? 'Add a client testimonial with name, comment, work, and rating in English and Arabic.'
            : 'Update the testimonial details.'}
        </p>
      </div>
      <TestimonialForm
        testimonial={mode === 'edit' ? (item ?? null) : null}
        onCancel={handleCancel}
      />
    </div>
  )
}
