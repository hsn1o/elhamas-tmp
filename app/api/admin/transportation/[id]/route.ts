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
    const item = await prisma.transportation.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Transportation not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (e) {
    console.error('Get transportation error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch transportation' },
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
    const existing = await prisma.transportation.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Transportation not found' }, { status: 404 })
    }
    const body = await request.json()
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn.trim() : existing.nameEn
    const nameAr = typeof body.nameAr === 'string' ? body.nameAr.trim() : existing.nameAr
    const vehicleType = typeof body.vehicleType === 'string' ? body.vehicleType.trim() : existing.vehicleType
    const vehicleTypeAr = body.vehicleTypeAr === null || body.vehicleTypeAr === '' ? null : typeof body.vehicleTypeAr === 'string' && body.vehicleTypeAr.trim() ? body.vehicleTypeAr.trim() : (existing as { vehicleTypeAr?: string | null }).vehicleTypeAr ?? null
    const capacity = typeof body.capacity === 'number' && body.capacity >= 1 ? body.capacity : Number(body.capacity) ?? existing.capacity
    const locationEn = body.locationEn === null || body.locationEn === '' ? null : typeof body.locationEn === 'string' && body.locationEn.trim() ? body.locationEn.trim() : (existing as { locationEn?: string | null }).locationEn ?? null
    const locationAr = body.locationAr === null || body.locationAr === '' ? null : typeof body.locationAr === 'string' && body.locationAr.trim() ? body.locationAr.trim() : (existing as { locationAr?: string | null }).locationAr ?? null
    const descriptionEn = body.descriptionEn === null || body.descriptionEn === '' ? null : typeof body.descriptionEn === 'string' && body.descriptionEn.trim() ? body.descriptionEn.trim() : existing.descriptionEn
    const descriptionAr = body.descriptionAr === null || body.descriptionAr === '' ? null : typeof body.descriptionAr === 'string' && body.descriptionAr.trim() ? body.descriptionAr.trim() : existing.descriptionAr
    const pricePerTrip = body.pricePerTrip === null || body.pricePerTrip === '' ? null : typeof body.pricePerTrip === 'number' && body.pricePerTrip >= 0 ? body.pricePerTrip : parseFloat(body.pricePerTrip) ?? Number(existing.pricePerTrip)
    const pricePerDay = body.pricePerDay === null || body.pricePerDay === '' ? null : typeof body.pricePerDay === 'number' && body.pricePerDay >= 0 ? body.pricePerDay : parseFloat(body.pricePerDay) ?? (existing.pricePerDay != null ? Number(existing.pricePerDay) : null)
    const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : existing.currency
    const imageUrl = body.imageUrl === null || body.imageUrl === '' ? null : typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : existing.imageUrl
    const gallery = Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : (existing as { gallery?: string[] }).gallery ?? []
    const featuresEn = Array.isArray(body.featuresEn) ? body.featuresEn.map(String).filter(Boolean) : existing.featuresEn
    const featuresAr = Array.isArray(body.featuresAr) ? body.featuresAr.map(String).filter(Boolean) : existing.featuresAr
    const excludesEn = Array.isArray(body.excludesEn) ? body.excludesEn.map(String).filter(Boolean) : (existing as { excludesEn?: string[] }).excludesEn ?? []
    const excludesAr = Array.isArray(body.excludesAr) ? body.excludesAr.map(String).filter(Boolean) : (existing as { excludesAr?: string[] }).excludesAr ?? []
    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured
    const isActive = body.isActive !== undefined ? body.isActive !== false : existing.isActive

    const item = await prisma.transportation.update({
      where: { id },
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
    console.error('Update transportation error:', e)
    return NextResponse.json(
      { error: 'Failed to update transportation' },
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
    await prisma.transportation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete transportation error:', e)
    return NextResponse.json(
      { error: 'Failed to delete transportation' },
      { status: 500 },
    )
  }
}
