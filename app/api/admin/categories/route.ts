import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const categories = await prisma.packageCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(categories)
  } catch (e) {
    console.error('List categories error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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
    const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : 0
    const imageUrl =
      typeof body.imageUrl === 'string' && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null

    const category = await prisma.packageCategory.create({
      data: { nameEn, nameAr, sortOrder, imageUrl },
    })
    return NextResponse.json(category)
  } catch (e) {
    console.error('Create category error:', e)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 },
    )
  }
}
