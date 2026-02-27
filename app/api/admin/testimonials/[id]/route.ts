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
    const row = await prisma.testimonial.findUnique({ where: { id } })
    if (!row) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }
    return NextResponse.json(row)
  } catch (e) {
    console.error('Get testimonial error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
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
    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }
    const body = await request.json()
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn.trim() : existing.nameEn
    const nameAr = typeof body.nameAr === 'string' ? body.nameAr.trim() : existing.nameAr
    const contentEn = typeof body.contentEn === 'string' ? body.contentEn.trim() : existing.contentEn
    const contentAr = typeof body.contentAr === 'string' ? body.contentAr.trim() : existing.contentAr
    const workEn = typeof body.workEn === 'string' ? body.workEn.trim() : null
    const workAr = typeof body.workAr === 'string' ? body.workAr.trim() : null
    const rating = typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5
      ? body.rating
      : existing.rating
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : existing.isActive
    if (!nameEn || !nameAr || !contentEn) {
      return NextResponse.json(
        { error: 'Name (EN), Name (AR), and Comment (EN) are required' },
        { status: 400 },
      )
    }
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        nameEn,
        nameAr: nameAr || nameEn,
        contentEn,
        contentAr: contentAr || contentEn,
        workEn,
        workAr,
        rating,
        isActive,
      },
    })
    return NextResponse.json(testimonial)
  } catch (e) {
    console.error('Update testimonial error:', e)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
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
    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Delete testimonial error:', e)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 },
    )
  }
}
