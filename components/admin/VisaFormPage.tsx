'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VisaForm } from './VisaForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

type VisaRow = {
  id: string
  nameEn: string
  nameAr: string
  visaTypeEn: string
  visaTypeAr?: string | null
  processingTimeEn?: string | null
  processingTimeAr?: string | null
  validityEn?: string | null
  validityAr?: string | null
  descriptionEn?: string | null
  descriptionAr?: string | null
  price?: number | string | null
  currency: string
  imageUrl?: string | null
  gallery?: string[]
  requirementsEn?: string[]
  requirementsAr?: string[]
  includesEn?: string[]
  includesAr?: string[]
  excludesEn?: string[]
  excludesAr?: string[]
  eligibilityEn?: string | null
  eligibilityAr?: string | null
  notesEn?: string | null
  notesAr?: string | null
  isFeatured: boolean
  isActive: boolean
}

export function VisaFormPage({
  mode,
  visaId,
}: {
  mode: 'create' | 'edit'
  visaId?: string
}) {
  const router = useRouter()
  const [item, setItem] = useState<VisaRow | null | undefined>(undefined)
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode === 'edit' && visaId) {
      setLoading(true)
      fetch(`/api/admin/visas/${visaId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setItem(data))
        .catch(() => setItem(null))
        .finally(() => setLoading(false))
    } else {
      setItem(null)
    }
  }, [mode, visaId])

  function handleSuccess() {
    router.push('/admin/visas')
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
        <Link href="/admin/visas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to visas
          </Button>
        </Link>
        <p className="text-muted-foreground">Visa not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/visas">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to visas
        </Button>
      </Link>
      <VisaForm
        visa={mode === 'edit' && item ? item : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
