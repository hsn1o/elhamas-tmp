import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const packages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(packages)
  } catch (e) {
    console.error('List packages error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
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

    const titleEn = typeof body.titleEn === 'string' ? body.titleEn.trim() : ''
    const titleAr = typeof body.titleAr === 'string' ? body.titleAr.trim() : ''
    if (!titleEn || !titleAr) {
      return NextResponse.json(
        { error: 'Title (EN) and Title (AR) are required' },
        { status: 400 },
      )
    }

    const categoryId =
      body.categoryId === null || body.categoryId === ''
        ? null
        : typeof body.categoryId === 'string' && body.categoryId.trim()
          ? body.categoryId.trim()
          : null
    const packageType =
      typeof body.packageType === 'string' ? body.packageType.trim() : 'umrah'
    const durationDays =
      typeof body.durationDays === 'number' && body.durationDays > 0
        ? body.durationDays
        : Number(body.durationDays) || 7
    const price =
      typeof body.price === 'number' && body.price >= 0
        ? body.price
        : parseFloat(body.price) || 0
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim()
        : 'SAR'

    const inclusionsEn = Array.isArray(body.inclusionsEn)
      ? body.inclusionsEn.map(String).filter(Boolean)
      : []
    const inclusionsAr = Array.isArray(body.inclusionsAr)
      ? body.inclusionsAr.map(String).filter(Boolean)
      : []
    const exclusionsEn = Array.isArray(body.exclusionsEn)
      ? body.exclusionsEn.map(String).filter(Boolean)
      : []
    const exclusionsAr = Array.isArray(body.exclusionsAr)
      ? body.exclusionsAr.map(String).filter(Boolean)
      : []

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
      : []

    const imageUrl =
      typeof body.imageUrl === 'string' && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null
    const gallery = Array.isArray(body.gallery)
      ? body.gallery.map(String).filter(Boolean)
      : []

    const descriptionEn =
      typeof body.descriptionEn === 'string' && body.descriptionEn.trim()
        ? body.descriptionEn.trim()
        : null
    const descriptionAr =
      typeof body.descriptionAr === 'string' && body.descriptionAr.trim()
        ? body.descriptionAr.trim()
        : null
    const shortDescriptionEn =
      typeof body.shortDescriptionEn === 'string' &&
        body.shortDescriptionEn.trim()
        ? body.shortDescriptionEn.trim()
        : null
    const shortDescriptionAr =
      typeof body.shortDescriptionAr === 'string' &&
        body.shortDescriptionAr.trim()
        ? body.shortDescriptionAr.trim()
        : null

    const locationId =
      body.locationId === null || body.locationId === ''
        ? null
        : typeof body.locationId === 'string' && body.locationId.trim()
          ? body.locationId.trim()
          : null

    const isFeatured = Boolean(body.isFeatured)
    const isActive = body.isActive !== false

    const pkg = await prisma.tourPackage.create({
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
    console.error('Create package error:', e)
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 },
    )
  }
}
