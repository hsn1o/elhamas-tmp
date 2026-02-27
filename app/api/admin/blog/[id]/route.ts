import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAuth() {
  const session = await getSession()
  if (!session) return null
  return session
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const item = await prisma.blogPost.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (e) {
    console.error('Get blog post error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    const body = await request.json()
    const titleEn = typeof body.titleEn === 'string' ? body.titleEn.trim() : existing.titleEn
    const titleAr = typeof body.titleAr === 'string' ? body.titleAr.trim() : existing.titleAr
    const slugRaw = typeof body.slug === 'string' ? body.slug.trim().toLowerCase().replace(/\s+/g, '-') : existing.slug
    const slug = slugRaw || titleEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || existing.slug
    const placeEn = body.placeEn === null || body.placeEn === '' ? null : typeof body.placeEn === 'string' && body.placeEn.trim() ? body.placeEn.trim() : (existing as { placeEn?: string | null }).placeEn ?? null
    const placeAr = body.placeAr === null || body.placeAr === '' ? null : typeof body.placeAr === 'string' && body.placeAr.trim() ? body.placeAr.trim() : (existing as { placeAr?: string | null }).placeAr ?? null
    const excerptEn = body.excerptEn === null || body.excerptEn === '' ? null : typeof body.excerptEn === 'string' && body.excerptEn.trim() ? body.excerptEn.trim() : existing.excerptEn
    const excerptAr = body.excerptAr === null || body.excerptAr === '' ? null : typeof body.excerptAr === 'string' && body.excerptAr.trim() ? body.excerptAr.trim() : existing.excerptAr
    const contentEn = body.contentEn === null || body.contentEn === '' ? null : typeof body.contentEn === 'string' && body.contentEn.trim() ? body.contentEn.trim() : existing.contentEn
    const contentAr = body.contentAr === null || body.contentAr === '' ? null : typeof body.contentAr === 'string' && body.contentAr.trim() ? body.contentAr.trim() : existing.contentAr
    const imageUrl = body.imageUrl === null || body.imageUrl === '' ? null : typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : existing.imageUrl
    const category = body.category === null || body.category === '' ? null : typeof body.category === 'string' && body.category.trim() ? body.category.trim() : existing.category
    const tags = Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean) : existing.tags ?? []
    const isPublished = body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished
    const publishedAt = body.publishedAt !== undefined
      ? (body.publishedAt ? new Date(body.publishedAt) : null)
      : existing.publishedAt

    const item = await prisma.blogPost.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        slug,
        placeEn,
        placeAr,
        excerptEn,
        excerptAr,
        contentEn,
        contentAr,
        imageUrl,
        category,
        tags,
        isPublished,
        publishedAt,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Update blog post error:', e)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete blog post error:', e)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 },
    )
  }
}
