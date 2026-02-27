'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BlogPostForm } from './BlogPostForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

type BlogPostRow = {
  id: string
  titleEn: string
  titleAr: string
  slug: string
  placeEn?: string | null
  placeAr?: string | null
  excerptEn?: string | null
  excerptAr?: string | null
  contentEn?: string | null
  contentAr?: string | null
  imageUrl?: string | null
  category?: string | null
  tags?: string[]
  isPublished: boolean
  publishedAt: string | null
}

export function BlogFormPage({
  mode,
  postId,
}: {
  mode: 'create' | 'edit'
  postId?: string
}) {
  const router = useRouter()
  const [item, setItem] = useState<BlogPostRow | null | undefined>(undefined)
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode === 'edit' && postId) {
      setLoading(true)
      fetch(`/api/admin/blog/${postId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setItem(data))
        .catch(() => setItem(null))
        .finally(() => setLoading(false))
    } else {
      setItem(null)
    }
  }, [mode, postId])

  function handleSuccess() {
    router.push('/admin/blog')
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
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Button>
        </Link>
        <p className="text-muted-foreground">Article not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/blog">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to articles
        </Button>
      </Link>
      <BlogPostForm
        post={mode === 'edit' && item ? item : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
