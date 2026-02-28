'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'

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

export function PlaceImageInline({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      onChange(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="shrink-0">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_IMAGES}
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleFile}
      />
      {value ? (
        <div className="flex flex-col gap-0.5 items-center">
          <div className="relative group">
            <div className="w-10 h-10 rounded border overflow-hidden bg-muted">
              <img src={value} alt="" className="w-full h-full object-cover" />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute inset-0 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/60"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Upload className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
          <button
            type="button"
            className="text-[10px] text-muted-foreground hover:text-destructive"
            onClick={() => onChange('')}
            disabled={disabled || uploading}
          >
            Remove
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
