import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const list = await prisma.event.findMany({ orderBy: { eventDate: 'desc' } })
    return NextResponse.json(list)
  } catch (e) {
    console.error('List events error:', e)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const titleEn = typeof body.titleEn === 'string' ? body.titleEn.trim() : ''
    const titleAr = typeof body.titleAr === 'string' ? body.titleAr.trim() : ''
    const slugInput = typeof body.slug === 'string' ? body.slug.trim() : ''
    if (!titleEn || !titleAr) {
      return NextResponse.json({ error: 'Title (EN) and Title (AR) are required' }, { status: 400 })
    }
    const finalSlug = slugInput ? slugify(slugInput) : slugify(titleEn)
    if (!finalSlug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 })

    const descriptionEn = typeof body.descriptionEn === 'string' && body.descriptionEn.trim() ? body.descriptionEn.trim() : null
    const descriptionAr = typeof body.descriptionAr === 'string' && body.descriptionAr.trim() ? body.descriptionAr.trim() : null
    const shortDescriptionEn = typeof body.shortDescriptionEn === 'string' && body.shortDescriptionEn.trim() ? body.shortDescriptionEn.trim() : null
    const shortDescriptionAr = typeof body.shortDescriptionAr === 'string' && body.shortDescriptionAr.trim() ? body.shortDescriptionAr.trim() : null
    const eventDate = body.eventDate ? new Date(body.eventDate) : new Date()
    const endDate = body.endDate ? new Date(body.endDate) : null
    const frequencyEn = typeof body.frequencyEn === 'string' && body.frequencyEn.trim() ? body.frequencyEn.trim() : null
    const frequencyAr = typeof body.frequencyAr === 'string' && body.frequencyAr.trim() ? body.frequencyAr.trim() : null
    const locationEn = typeof body.locationEn === 'string' && body.locationEn.trim() ? body.locationEn.trim() : null
    const locationAr = typeof body.locationAr === 'string' && body.locationAr.trim() ? body.locationAr.trim() : null
    const imageUrl = typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : null
    const gallery = Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : []
    const price = body.price != null && body.price !== '' ? Number(body.price) : null
    const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : 'SAR'
    const maxAttendees = body.maxAttendees != null && body.maxAttendees !== '' ? Number(body.maxAttendees) : null
    const isFeatured = Boolean(body.isFeatured)
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true

    const item = await prisma.event.create({
      data: {
        titleEn,
        titleAr,
        slug: finalSlug,
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
    console.error('Create event error:', e)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
