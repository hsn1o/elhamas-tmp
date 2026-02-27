import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const list = await prisma.transportation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(list)
  } catch (e) {
    console.error('List transportation error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch transportation' },
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
    const vehicleType = typeof body.vehicleType === 'string' ? body.vehicleType.trim() : 'Sedan'
    const vehicleTypeAr = typeof body.vehicleTypeAr === 'string' && body.vehicleTypeAr.trim() ? body.vehicleTypeAr.trim() : null
    const capacity = typeof body.capacity === 'number' && body.capacity >= 1 ? body.capacity : Number(body.capacity) || 4
    const locationEn = typeof body.locationEn === 'string' && body.locationEn.trim() ? body.locationEn.trim() : null
    const locationAr = typeof body.locationAr === 'string' && body.locationAr.trim() ? body.locationAr.trim() : null
    const descriptionEn = typeof body.descriptionEn === 'string' && body.descriptionEn.trim() ? body.descriptionEn.trim() : null
    const descriptionAr = typeof body.descriptionAr === 'string' && body.descriptionAr.trim() ? body.descriptionAr.trim() : null
    const pricePerTrip = typeof body.pricePerTrip === 'number' && body.pricePerTrip >= 0 ? body.pricePerTrip : parseFloat(body.pricePerTrip) ?? null
    const pricePerDay = typeof body.pricePerDay === 'number' && body.pricePerDay >= 0 ? body.pricePerDay : parseFloat(body.pricePerDay) ?? null
    const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : 'SAR'
    const imageUrl = typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : null
    const gallery = Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : []
    const featuresEn = Array.isArray(body.featuresEn) ? body.featuresEn.map(String).filter(Boolean) : []
    const featuresAr = Array.isArray(body.featuresAr) ? body.featuresAr.map(String).filter(Boolean) : []
    const excludesEn = Array.isArray(body.excludesEn) ? body.excludesEn.map(String).filter(Boolean) : []
    const excludesAr = Array.isArray(body.excludesAr) ? body.excludesAr.map(String).filter(Boolean) : []
    const isFeatured = Boolean(body.isFeatured)
    const isActive = body.isActive !== false

    const item = await prisma.transportation.create({
      data: {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        vehicleType,
        vehicleTypeAr,
        capacity,
        locationEn,
        locationAr,
        pricePerTrip,
        pricePerDay,
        currency,
        imageUrl,
        gallery,
        featuresEn,
        featuresAr,
        excludesEn,
        excludesAr,
        isFeatured,
        isActive,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Create transportation error:', e)
    return NextResponse.json(
      { error: 'Failed to create transportation' },
      { status: 500 },
    )
  }
}
