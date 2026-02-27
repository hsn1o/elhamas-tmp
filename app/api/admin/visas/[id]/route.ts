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
    // @ts-expect-error - Visa model exists after prisma generate
    const item = await prisma.visa.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Visa not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (e) {
    console.error('Get visa error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch visa' },
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
    // @ts-expect-error - Visa model exists after prisma generate
    const existing = await prisma.visa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Visa not found' }, { status: 404 })
    }
    const body = await request.json()
    const raw = existing as Record<string, unknown>
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn.trim() : (existing as { nameEn: string }).nameEn
    const nameAr = typeof body.nameAr === 'string' ? body.nameAr.trim() : (existing as { nameAr: string }).nameAr
    const visaTypeEn = typeof body.visaTypeEn === 'string' ? body.visaTypeEn.trim() : (existing as { visaTypeEn: string }).visaTypeEn
    const visaTypeAr = body.visaTypeAr === null || body.visaTypeAr === '' ? null : typeof body.visaTypeAr === 'string' && body.visaTypeAr.trim() ? body.visaTypeAr.trim() : (raw.visaTypeAr as string | null) ?? null
    const processingTimeEn = body.processingTimeEn === null || body.processingTimeEn === '' ? null : typeof body.processingTimeEn === 'string' && body.processingTimeEn.trim() ? body.processingTimeEn.trim() : (raw.processingTimeEn as string | null) ?? null
    const processingTimeAr = body.processingTimeAr === null || body.processingTimeAr === '' ? null : typeof body.processingTimeAr === 'string' && body.processingTimeAr.trim() ? body.processingTimeAr.trim() : (raw.processingTimeAr as string | null) ?? null
    const validityEn = body.validityEn === null || body.validityEn === '' ? null : typeof body.validityEn === 'string' && body.validityEn.trim() ? body.validityEn.trim() : (raw.validityEn as string | null) ?? null
    const validityAr = body.validityAr === null || body.validityAr === '' ? null : typeof body.validityAr === 'string' && body.validityAr.trim() ? body.validityAr.trim() : (raw.validityAr as string | null) ?? null
    const descriptionEn = body.descriptionEn === null || body.descriptionEn === '' ? null : typeof body.descriptionEn === 'string' && body.descriptionEn.trim() ? body.descriptionEn.trim() : (existing as { descriptionEn: string | null }).descriptionEn
    const descriptionAr = body.descriptionAr === null || body.descriptionAr === '' ? null : typeof body.descriptionAr === 'string' && body.descriptionAr.trim() ? body.descriptionAr.trim() : (existing as { descriptionAr: string | null }).descriptionAr
    const priceParsed = body.price === null || body.price === '' ? null : typeof body.price === 'number' && body.price >= 0 ? body.price : parseFloat(body.price)
    const price = priceParsed != null && !Number.isNaN(priceParsed) ? priceParsed : (existing as { price: unknown }).price != null ? Number((existing as { price: { toString: () => string } }).price) : null
    const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : (existing as { currency: string }).currency
    const imageUrl = body.imageUrl === null || body.imageUrl === '' ? null : typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : (existing as { imageUrl: string | null }).imageUrl
    const gallery = Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : ((raw.gallery as string[]) ?? [])
    const requirementsEn = Array.isArray(body.requirementsEn) ? body.requirementsEn.map(String).filter(Boolean) : ((raw.requirementsEn as string[]) ?? [])
    const requirementsAr = Array.isArray(body.requirementsAr) ? body.requirementsAr.map(String).filter(Boolean) : ((raw.requirementsAr as string[]) ?? [])
    const includesEn = Array.isArray(body.includesEn) ? body.includesEn.map(String).filter(Boolean) : ((raw.includesEn as string[]) ?? [])
    const includesAr = Array.isArray(body.includesAr) ? body.includesAr.map(String).filter(Boolean) : ((raw.includesAr as string[]) ?? [])
    const excludesEn = Array.isArray(body.excludesEn) ? body.excludesEn.map(String).filter(Boolean) : ((raw.excludesEn as string[]) ?? [])
    const excludesAr = Array.isArray(body.excludesAr) ? body.excludesAr.map(String).filter(Boolean) : ((raw.excludesAr as string[]) ?? [])
    const eligibilityEn = body.eligibilityEn === null || body.eligibilityEn === '' ? null : typeof body.eligibilityEn === 'string' && body.eligibilityEn.trim() ? body.eligibilityEn.trim() : (raw.eligibilityEn as string | null) ?? null
    const eligibilityAr = body.eligibilityAr === null || body.eligibilityAr === '' ? null : typeof body.eligibilityAr === 'string' && body.eligibilityAr.trim() ? body.eligibilityAr.trim() : (raw.eligibilityAr as string | null) ?? null
    const notesEn = body.notesEn === null || body.notesEn === '' ? null : typeof body.notesEn === 'string' && body.notesEn.trim() ? body.notesEn.trim() : (raw.notesEn as string | null) ?? null
    const notesAr = body.notesAr === null || body.notesAr === '' ? null : typeof body.notesAr === 'string' && body.notesAr.trim() ? body.notesAr.trim() : (raw.notesAr as string | null) ?? null
    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : (existing as { isFeatured: boolean }).isFeatured
    const isActive = body.isActive !== undefined ? body.isActive !== false : (existing as { isActive: boolean }).isActive

    // @ts-expect-error - Visa model exists after prisma generate
    const item = await prisma.visa.update({
      where: { id },
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
    console.error('Update visa error:', e)
    return NextResponse.json(
      { error: 'Failed to update visa' },
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
    // @ts-expect-error - Visa model exists after prisma generate
    await prisma.visa.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete visa error:', e)
    return NextResponse.json(
      { error: 'Failed to delete visa' },
      { status: 500 },
    )
  }
}
