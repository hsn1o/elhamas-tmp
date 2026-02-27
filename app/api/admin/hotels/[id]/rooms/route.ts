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

  const { id: hotelId } = await params
  try {
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }
    const rooms = await prisma.room.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(rooms)
  } catch (e) {
    console.error('List rooms error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: hotelId } = await params
  try {
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const body = await request.json()
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn.trim() : ''
    const nameAr = typeof body.nameAr === 'string' ? body.nameAr.trim() : ''
    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: 'Name (EN) and Name (AR) are required' },
        { status: 400 },
      )
    }
    const descriptionEn =
      typeof body.descriptionEn === 'string' && body.descriptionEn.trim()
        ? body.descriptionEn.trim()
        : null
    const descriptionAr =
      typeof body.descriptionAr === 'string' && body.descriptionAr.trim()
        ? body.descriptionAr.trim()
        : null
    const pricePerNight =
      typeof body.pricePerNight === 'number' && body.pricePerNight >= 0
        ? body.pricePerNight
        : parseFloat(body.pricePerNight) ?? 0
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim()
        : 'SAR'
    const maxGuests =
      typeof body.maxGuests === 'number' && body.maxGuests >= 1
        ? body.maxGuests
        : Number(body.maxGuests) || 1
    const amenities = Array.isArray(body.amenities)
      ? body.amenities.map(String).filter(Boolean)
      : []
    const amenitiesAr = Array.isArray(body.amenitiesAr)
      ? body.amenitiesAr.map(String).filter(Boolean)
      : []
    const imageUrl =
      typeof body.imageUrl === 'string' && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null
    const isActive = body.isActive !== false

    const room = await prisma.room.create({
      data: {
        hotelId,
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        pricePerNight,
        currency,
        maxGuests,
        amenities,
        amenitiesAr,
        imageUrl,
        isActive,
      },
    })

    return NextResponse.json(room)
  } catch (e) {
    console.error('Create room error:', e)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 },
    )
  }
}
