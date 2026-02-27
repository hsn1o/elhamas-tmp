import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    // @ts-expect-error - Visa model exists after prisma generate
    const list = await prisma.visa.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(list)
  } catch (e) {
    console.error('List visas error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch visas' },
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
    const visaTypeEn = typeof body.visaTypeEn === 'string' ? body.visaTypeEn.trim() : 'Umrah'
    const visaTypeAr = typeof body.visaTypeAr === 'string' && body.visaTypeAr.trim() ? body.visaTypeAr.trim() : null
    const processingTimeEn = typeof body.processingTimeEn === 'string' && body.processingTimeEn.trim() ? body.processingTimeEn.trim() : null
    const processingTimeAr = typeof body.processingTimeAr === 'string' && body.processingTimeAr.trim() ? body.processingTimeAr.trim() : null
    const validityEn = typeof body.validityEn === 'string' && body.validityEn.trim() ? body.validityEn.trim() : null
    const validityAr = typeof body.validityAr === 'string' && body.validityAr.trim() ? body.validityAr.trim() : null
    const descriptionEn = typeof body.descriptionEn === 'string' && body.descriptionEn.trim() ? body.descriptionEn.trim() : null
    const descriptionAr = typeof body.descriptionAr === 'string' && body.descriptionAr.trim() ? body.descriptionAr.trim() : null
    const price = body.price === null || body.price === '' ? null : typeof body.price === 'number' && body.price >= 0 ? body.price : parseFloat(body.price) ?? null
    const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : 'SAR'
    const imageUrl = typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : null
    const gallery = Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : []
    const requirementsEn = Array.isArray(body.requirementsEn) ? body.requirementsEn.map(String).filter(Boolean) : []
    const requirementsAr = Array.isArray(body.requirementsAr) ? body.requirementsAr.map(String).filter(Boolean) : []
    const includesEn = Array.isArray(body.includesEn) ? body.includesEn.map(String).filter(Boolean) : []
    const includesAr = Array.isArray(body.includesAr) ? body.includesAr.map(String).filter(Boolean) : []
    const excludesEn = Array.isArray(body.excludesEn) ? body.excludesEn.map(String).filter(Boolean) : []
    const excludesAr = Array.isArray(body.excludesAr) ? body.excludesAr.map(String).filter(Boolean) : []
    const eligibilityEn = typeof body.eligibilityEn === 'string' && body.eligibilityEn.trim() ? body.eligibilityEn.trim() : null
    const eligibilityAr = typeof body.eligibilityAr === 'string' && body.eligibilityAr.trim() ? body.eligibilityAr.trim() : null
    const notesEn = typeof body.notesEn === 'string' && body.notesEn.trim() ? body.notesEn.trim() : null
    const notesAr = typeof body.notesAr === 'string' && body.notesAr.trim() ? body.notesAr.trim() : null
    const isFeatured = Boolean(body.isFeatured)
    const isActive = body.isActive !== false

    // @ts-expect-error - Visa model exists after prisma generate
    const item = await prisma.visa.create({
      data: {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        visaTypeEn,
        visaTypeAr,
        processingTimeEn,
        processingTimeAr,
        validityEn,
        validityAr,
        price,
        currency,
        imageUrl,
        gallery,
        requirementsEn,
        requirementsAr,
        includesEn,
        includesAr,
        excludesEn,
        excludesAr,
        eligibilityEn,
        eligibilityAr,
        notesEn,
        notesAr,
        isFeatured,
        isActive,
      },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error('Create visa error:', e)
    return NextResponse.json(
      { error: 'Failed to create visa' },
      { status: 500 },
    )
  }
}
