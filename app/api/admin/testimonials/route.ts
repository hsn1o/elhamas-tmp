import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const list = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(list)
  } catch (e) {
    console.error('List testimonials error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
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
    const contentEn = typeof body.contentEn === 'string' ? body.contentEn.trim() : ''
    const contentAr = typeof body.contentAr === 'string' ? body.contentAr.trim() : null
    const workEn = typeof body.workEn === 'string' ? body.workEn.trim() : null
    const workAr = typeof body.workAr === 'string' ? body.workAr.trim() : null
    const rating = typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5
      ? body.rating
      : 5
    if (!nameEn || !nameAr || !contentEn) {
      return NextResponse.json(
        { error: 'Name (EN), Name (AR), and Comment (EN) are required' },
        { status: 400 },
      )
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        nameEn,
        nameAr: nameAr || nameEn,
        contentEn,
        contentAr: contentAr || contentEn,
        workEn: workEn || null,
        workAr: workAr || null,
        rating,
        isActive: true,
      },
    })
    return NextResponse.json(testimonial)
  } catch (e) {
    console.error('Create testimonial error:', e)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 },
    )
  }
}
