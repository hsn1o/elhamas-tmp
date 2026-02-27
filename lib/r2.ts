import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const bucketName = process.env.R2_BUCKET_NAME
const publicUrl = process.env.R2_PUBLIC_URL

export function getR2Client(): S3Client | null {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export function getR2PublicUrl(key: string): string | null {
  if (!publicUrl) return null
  const base = publicUrl.replace(/\/$/, '')
  return `${base}/${key}`
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return { ok: false, error: 'Invalid file type. Use JPEG, PNG, WebP or GIF.' }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: 'File too large. Max 5MB.' }
  }
  return { ok: true }
}

export async function uploadToR2(
  buffer: Buffer,
  contentType: string,
  key: string
): Promise<string | null> {
  const client = getR2Client()
  if (!client || !bucketName) return null

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return getR2PublicUrl(key)
}
