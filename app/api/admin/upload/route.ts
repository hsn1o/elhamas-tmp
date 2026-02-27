import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { uploadToR2, validateImageFile } from '@/lib/r2'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided. Use form field "file".' },
        { status: 400 },
      )
    }

    const validation = validateImageFile(file)
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg'
    const key = `packages/${randomBytes(12).toString('hex')}.${safeExt}`

    const url = await uploadToR2(buffer, file.type, key)
    if (!url) {
      return NextResponse.json(
        { error: 'R2 upload failed. Check R2_* env variables.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ url })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 },
    )
  }
}
