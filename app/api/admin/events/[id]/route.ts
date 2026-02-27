import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAuth() {
  const session = await getSession()
  if (!session) return null
  return session
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
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
    const item = await prisma.event.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (e) {
    console.error('Get event error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
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
    const existing = await prisma.event.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    const body = await request.json()
    const titleEn = typeof body.titleEn === 'string' ? body.titleEn.trim() : existing.titleEn
    const titleAr = typeof body.titleAr === 'string' ? body.titleAr.trim() : existing.titleAr
    const slugRaw = typeof body.slug === 'string' ? body.slug.trim() : existing.slug
    const slug = slugRaw ? slugify(slugRaw) : existing.slug
    const descriptionEn = body.descriptionEn === null || body.descriptionEn === '' ? null : typeof body.descriptionEn === 'string' && body.descriptionEn.trim() ? body.descriptionEn.trim() : existing.descriptionEn
    const descriptionAr = body.descriptionAr === null || body.descriptionAr === '' ? null : typeof body.descriptionAr === 'string' && body.descriptionAr.trim() ? body.descriptionAr.trim() : existing.descriptionAr
    const shortDescriptionEn = body.shortDescriptionEn === null || body.shortDescriptionEn === '' ? null : typeof body.shortDescriptionEn === 'string' && body.shortDescriptionEn.trim() ? body.shortDescriptionEn.trim() : existing.shortDescriptionEn
    const shortDescriptionAr = body.shortDescriptionAr === null || body.shortDescriptionAr === '' ? null : typeof body.shortDescriptionAr === 'string' && body.shortDescriptionAr.trim() ? body.shortDescriptionAr.trim() : existing.shortDescriptionAr
    const eventDate = body.eventDate != null ? new Date(body.eventDate) : existing.eventDate
    const endDate = body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : existing.endDate
    const frequencyEn = body.frequencyEn === null || body.frequencyEn === '' ? null : typeof body.frequencyEn === 'string' && body.frequencyEn.trim() ? body.frequencyEn.trim() : (existing as { frequencyEn?: string | null }).frequencyEn ?? null
    const frequencyAr = body.frequencyAr === null || body.frequencyAr === '' ? null : typeof body.frequencyAr === 'string' && body.frequencyAr.trim() ? body.frequencyAr.trim() : (existing as { frequencyAr?: string | null }).frequencyAr ?? null
    const locationEn = body.locationEn === null || body.locationEn === '' ? null : typeof body.locationEn === 'string' && body.locationEn.trim() ? body.locationEn.trim() : existing.locationEn
    const locationAr = body.locationAr === null || body.locationAr === '' ? null : typeof body.locationAr === 'string' && body.locationAr.trim() ? body.locationAr.trim() : existing.locationAr
    const imageUrl = body.imageUrl === null || body.imageUrl === '' ? null : typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : existing.imageUrl
    const gallery = Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : existing.gallery ?? []
    const price = body.price !== undefined ? (body.price != null && body.price !== '' ? Number(body.price) : null) : existing.price
    const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : existing.currency
    const maxAttendees = body.maxAttendees !== undefined ? (body.maxAttendees != null && body.maxAttendees !== '' ? Number(body.maxAttendees) : null) : existing.maxAttendees
    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive

    const item = await prisma.event.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        slug,
        descriptionEn,
        descriptionAr,
        shortDescriptionEn,
        shortDescriptionAr,
        eventDate,
        endDate,
        frequencyEn,
        frequencyAr,
        locationEn,
        locationAr,
        imageUrl,
        gallery,
        price,
        currency,
        maxAttendees,
        isFeatured,
        isActive,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Update event error:', e)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
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
    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete event error:', e)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
