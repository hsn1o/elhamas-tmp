import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' },
      include: { location: true, _count: { select: { rooms: true } } },
    })
    return NextResponse.json(hotels)
  } catch (e) {
    console.error('List hotels error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const nameEn = typeof body.nameEn === 'string' ? body.nameEn.trim() : ''
    const nameAr = typeof body.nameAr === 'string' ? body.nameAr.trim() : ''
    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: 'Name (EN) and Name (AR) are required' },
        { status: 400 },
      )
    }

    const locationId =
      body.locationId === null || body.locationId === ''
        ? null
        : typeof body.locationId === 'string' && body.locationId.trim()
          ? body.locationId.trim()
          : null
    const city = typeof body.city === 'string' ? body.city.trim() : ''
    const cityAr =
      typeof body.cityAr === 'string' && body.cityAr.trim()
        ? body.cityAr.trim()
        : null
    const descriptionEn =
      typeof body.descriptionEn === 'string' && body.descriptionEn.trim()
        ? body.descriptionEn.trim()
        : null
    const descriptionAr =
      typeof body.descriptionAr === 'string' && body.descriptionAr.trim()
        ? body.descriptionAr.trim()
        : null
    const locationEn =
      typeof body.locationEn === 'string' && body.locationEn.trim()
        ? body.locationEn.trim()
        : null
    const locationAr =
      typeof body.locationAr === 'string' && body.locationAr.trim()
        ? body.locationAr.trim()
        : null
    const distanceToHaram =
      typeof body.distanceToHaram === 'string' && body.distanceToHaram.trim()
        ? body.distanceToHaram.trim()
        : null
    const starRating =
      typeof body.starRating === 'number' && body.starRating >= 1 && body.starRating <= 5
        ? body.starRating
        : Number(body.starRating) || 5
    const pricePerNight =
      typeof body.pricePerNight === 'number' && body.pricePerNight >= 0
        ? body.pricePerNight
        : parseFloat(body.pricePerNight) ?? null
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim()
        : 'SAR'
    const imageUrl =
      typeof body.imageUrl === 'string' && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null
    const gallery = Array.isArray(body.gallery)
      ? body.gallery.map(String).filter(Boolean)
      : []
    const amenities = Array.isArray(body.amenities)
      ? body.amenities.map(String).filter(Boolean)
      : []
    const amenitiesAr = Array.isArray(body.amenitiesAr)
      ? body.amenitiesAr.map(String).filter(Boolean)
      : []
    const isFeatured = Boolean(body.isFeatured)
    const isActive = body.isActive !== false

    const hotel = await prisma.hotel.create({
      data: {
        locationId,
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        locationEn,
        locationAr,
        city: city || 'Mecca',
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
    console.error('Create hotel error:', e)
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 },
    )
  }
}
