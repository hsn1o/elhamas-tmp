'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, Plus, Trash2, Loader2 } from 'lucide-react'

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/gif'

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  if (!data.url) throw new Error('No URL returned')
  return data.url
}

export function FeaturedImageUpload({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const url = await uploadFile(file)
      onChange(url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Featured image *</Label>
      {value ? (
        <div className="flex items-start gap-3">
          <div className="relative w-32 h-32 rounded-lg border overflow-hidden bg-muted shrink-0">
            <img src={value} alt="Featured" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploading ? 'Uploading…' : 'Replace'}
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={() => onChange('')}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_IMAGES}
            className="hidden"
            disabled={disabled || uploading}
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Uploading…' : 'Upload featured image'}
          </Button>
        </div>
      )}
      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
    </div>
  )
}

export function GalleryUpload({
  urls,
  onChange,
  disabled,
}: {
  urls: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const fileArray = input.files ? Array.from(input.files) : []
    input.value = ''
    if (!fileArray.length) return
    setUploadError('')
    setUploading(true)
    try {
      const added: string[] = []
      for (const file of fileArray) {
        const url = await uploadFile(file)
        added.push(url)
      }
      onChange([...urls, ...added])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label>Gallery images *</Label>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={i} className="relative group">
            <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-90"
              disabled={disabled}
              onClick={() => remove(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_IMAGES}
            multiple
            className="hidden"
            disabled={disabled || uploading}
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            size={uploading ? 'default' : 'icon'}
            className={uploading ? 'w-24 h-24 flex flex-col gap-1.5' : 'w-24 h-24'}
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin shrink-0" />
                <span className="text-xs">Uploading…</span>
              </>
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
      {urls.length === 0 && (
        <p className="text-sm text-muted-foreground">Upload at least one image.</p>
      )}
    </div>
  )
}
