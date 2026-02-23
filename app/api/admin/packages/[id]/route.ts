import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAuth() {
  const session = await getSession()
  if (!session) {
    return null
  }
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
    const pkg = await prisma.tourPackage.findUnique({ where: { id } })
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }
    return NextResponse.json(pkg)
  } catch (e) {
    console.error('Get package error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch package' },
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
    const existing = await prisma.tourPackage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const body = await request.json()

    const titleEn =
      typeof body.titleEn === 'string' ? body.titleEn.trim() : existing.titleEn
    const titleAr =
      typeof body.titleAr === 'string' ? body.titleAr.trim() : existing.titleAr

    const categoryId =
      body.categoryId === undefined
        ? existing.categoryId
        : body.categoryId === null || body.categoryId === ''
          ? null
          : typeof body.categoryId === 'string' && body.categoryId.trim()
            ? body.categoryId.trim()
            : existing.categoryId
    const packageType =
      typeof body.packageType === 'string'
        ? body.packageType.trim()
        : existing.packageType
    const durationDays =
      typeof body.durationDays === 'number' && body.durationDays > 0
        ? body.durationDays
        : Number(body.durationDays) || existing.durationDays
    const price =
      typeof body.price === 'number' && body.price >= 0
        ? body.price
        : parseFloat(body.price) ?? Number(existing.price)
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim()
        : existing.currency

    const inclusionsEn = Array.isArray(body.inclusionsEn)
      ? body.inclusionsEn.map(String).filter(Boolean)
      : existing.inclusionsEn
    const inclusionsAr = Array.isArray(body.inclusionsAr)
      ? body.inclusionsAr.map(String).filter(Boolean)
      : existing.inclusionsAr
    const exclusionsEn = Array.isArray(body.exclusionsEn)
      ? body.exclusionsEn.map(String).filter(Boolean)
      : existing.exclusionsEn
    const exclusionsAr = Array.isArray(body.exclusionsAr)
      ? body.exclusionsAr.map(String).filter(Boolean)
      : existing.exclusionsAr

    const itinerary = Array.isArray(body.itinerary)
      ? body.itinerary
        .filter(
          (d: unknown) =>
            d != null &&
            typeof d === 'object' &&
            'day' in d &&
            typeof (d as { day: unknown }).day === 'number',
        )
        .map((d: { day: number; titleEn?: string; titleAr?: string }) => ({
          day: (d as { day: number }).day,
          title_en: String((d as { titleEn?: string }).titleEn ?? ''),
          title_ar: String((d as { titleAr?: string }).titleAr ?? ''),
        }))
      : Array.isArray(existing.itinerary)
        ? (existing.itinerary as { day: number; title_en: string; title_ar: string }[])
        : []

    const imageUrl =
      body.imageUrl === null || body.imageUrl === ''
        ? null
        : typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : existing.imageUrl
    const gallery = Array.isArray(body.gallery)
      ? body.gallery.map(String).filter(Boolean)
      : existing.gallery

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
    const shortDescriptionEn =
      body.shortDescriptionEn === null || body.shortDescriptionEn === ''
        ? null
        : typeof body.shortDescriptionEn === 'string' &&
          body.shortDescriptionEn.trim()
          ? body.shortDescriptionEn.trim()
          : existing.shortDescriptionEn
    const shortDescriptionAr =
      body.shortDescriptionAr === null || body.shortDescriptionAr === ''
        ? null
        : typeof body.shortDescriptionAr === 'string' &&
          body.shortDescriptionAr.trim()
          ? body.shortDescriptionAr.trim()
          : existing.shortDescriptionAr

    const locationId =
      body.locationId === undefined
        ? existing.locationId
        : body.locationId === null || body.locationId === ''
          ? null
          : typeof body.locationId === 'string' && body.locationId.trim()
            ? body.locationId.trim()
            : existing.locationId

    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured
    const isActive = body.isActive !== undefined ? body.isActive !== false : existing.isActive

    const pkg = await prisma.tourPackage.update({
      where: { id },
      data: {
        categoryId,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        shortDescriptionEn,
        shortDescriptionAr,
        locationId,
        packageType,
        durationDays,
        price,
        currency,
        inclusionsEn,
        inclusionsAr,
        exclusionsEn,
        exclusionsAr,
        itinerary: itinerary.length ? itinerary : undefined,
        imageUrl,
        gallery,
        isFeatured,
        isActive,
      },
    })

    return NextResponse.json(pkg)
  } catch (e) {
    console.error('Update package error:', e)
    return NextResponse.json(
      { error: 'Failed to update package' },
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
    await prisma.tourPackage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete package error:', e)
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 },
    )
  }
}
