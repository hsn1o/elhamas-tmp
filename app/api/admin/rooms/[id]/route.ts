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
    const room = await prisma.room.findUnique({ where: { id } })
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    return NextResponse.json(room)
  } catch (e) {
    console.error('Get room error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch room' },
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
    const existing = await prisma.room.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const body = await request.json()
    const nameEn =
      typeof body.nameEn === 'string' ? body.nameEn.trim() : existing.nameEn
    const nameAr =
      typeof body.nameAr === 'string' ? body.nameAr.trim() : existing.nameAr
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
    const pricePerNight =
      typeof body.pricePerNight === 'number' && body.pricePerNight >= 0
        ? body.pricePerNight
        : parseFloat(body.pricePerNight) ?? Number(existing.pricePerNight)
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim()
        : existing.currency
    const maxGuests =
      typeof body.maxGuests === 'number' && body.maxGuests >= 1
        ? body.maxGuests
        : Number(body.maxGuests) ?? existing.maxGuests
    const amenities = Array.isArray(body.amenities)
      ? body.amenities.map(String).filter(Boolean)
      : existing.amenities
    const amenitiesAr = Array.isArray(body.amenitiesAr)
      ? body.amenitiesAr.map(String).filter(Boolean)
      : (existing as { amenitiesAr?: string[] }).amenitiesAr ?? existing.amenities
    const imageUrl =
      body.imageUrl === null || body.imageUrl === ''
        ? null
        : typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : existing.imageUrl
    const isActive = body.isActive !== undefined ? body.isActive !== false : existing.isActive

    const room = await prisma.room.update({
      where: { id },
      data: {
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
    console.error('Update room error:', e)
    return NextResponse.json(
      { error: 'Failed to update room' },
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
    await prisma.room.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete room error:', e)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 },
    )
  }
}
