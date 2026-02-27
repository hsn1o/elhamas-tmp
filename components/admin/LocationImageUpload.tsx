'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

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

export function LocationImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
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
    <div className="space-y-2 mb-2">
      <p className="text-xs font-medium text-muted-foreground">Image (optional)</p>
      {value ? (
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 rounded border overflow-hidden bg-muted shrink-0">
            <img src={value} alt="Location" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-3 w-3 mr-1" />
              {uploading ? '…' : 'Replace'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onChange('')}
            >
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
            disabled={uploading}
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading…' : 'Upload from device'}
          </Button>
        </div>
      )}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  )
}
