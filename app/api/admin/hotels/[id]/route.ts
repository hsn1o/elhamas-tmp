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
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { location: true, rooms: true },
    })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }
    return NextResponse.json(hotel)
  } catch (e) {
    console.error('Get hotel error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
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
    const existing = await prisma.hotel.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }
    const body = await request.json()
    const nameEn =
      typeof body.nameEn === 'string' ? body.nameEn.trim() : existing.nameEn
    const nameAr =
      typeof body.nameAr === 'string' ? body.nameAr.trim() : existing.nameAr
    const locationId =
      body.locationId === undefined
        ? existing.locationId
        : body.locationId === null || body.locationId === ''
          ? null
          : typeof body.locationId === 'string' && body.locationId.trim()
            ? body.locationId.trim()
            : existing.locationId
    const city = typeof body.city === 'string' ? body.city.trim() : existing.city
    const cityAr =
      body.cityAr === null || body.cityAr === ''
        ? null
        : typeof body.cityAr === 'string' && body.cityAr.trim()
          ? body.cityAr.trim()
          : (existing as { cityAr?: string | null }).cityAr ?? null
    const descriptionEn =
      body.descriptionEn === null || body.descriptionEn === ''
        ? null
        : typeof body.descriptionEn === 'string' && body.descriptionEn.trim()
          ? body.descriptionEn.trim()
          : existing.descriptionEn
    const descriptionAr =
      body.descriptionAr === null || body.descriptionAr === ''
        ? null
        : typeof body.descriptionAr === 'string' && body.descriptionAr.trim()
          ? body.descriptionAr.trim()
          : existing.descriptionAr
    const locationEn =
      body.locationEn === null || body.locationEn === ''
        ? null
        : typeof body.locationEn === 'string' && body.locationEn.trim()
          ? body.locationEn.trim()
          : existing.locationEn
    const locationAr =
      body.locationAr === null || body.locationAr === ''
        ? null
        : typeof body.locationAr === 'string' && body.locationAr.trim()
          ? body.locationAr.trim()
          : existing.locationAr
    const distanceToHaram =
      body.distanceToHaram === null || body.distanceToHaram === ''
        ? null
        : typeof body.distanceToHaram === 'string' && body.distanceToHaram.trim()
          ? body.distanceToHaram.trim()
          : existing.distanceToHaram
    const starRating =
      typeof body.starRating === 'number' && body.starRating >= 1 && body.starRating <= 5
        ? body.starRating
        : Number(body.starRating) ?? existing.starRating
    const pricePerNight =
      body.pricePerNight === null || body.pricePerNight === ''
        ? null
        : typeof body.pricePerNight === 'number' && body.pricePerNight >= 0
          ? body.pricePerNight
          : parseFloat(body.pricePerNight) ?? Number(existing.pricePerNight)
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim()
        : existing.currency
    const imageUrl =
      body.imageUrl === null || body.imageUrl === ''
        ? null
        : typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : existing.imageUrl
    const gallery = Array.isArray(body.gallery)
      ? body.gallery.map(String).filter(Boolean)
      : existing.gallery
    const amenities = Array.isArray(body.amenities)
      ? body.amenities.map(String).filter(Boolean)
      : existing.amenities
    const amenitiesAr = Array.isArray(body.amenitiesAr)
      ? body.amenitiesAr.map(String).filter(Boolean)
      : (existing as { amenitiesAr?: string[] }).amenitiesAr ?? existing.amenities
    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured
    const isActive = body.isActive !== undefined ? body.isActive !== false : existing.isActive

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        locationId,
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        locationEn,
        locationAr,
        city,
        cityAr,
        distanceToHaram,
        starRating,
        pricePerNight,
        currency,
        imageUrl,
        gallery,
        amenities,
        amenitiesAr,
        isFeatured,
        isActive,
      },
    })
    return NextResponse.json(hotel)
  } catch (e) {
    console.error('Update hotel error:', e)
    return NextResponse.json(
      { error: 'Failed to update hotel' },
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
    await prisma.hotel.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete hotel error:', e)
    return NextResponse.json(
      { error: 'Failed to delete hotel' },
      { status: 500 },
    )
  }
}
