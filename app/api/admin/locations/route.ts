import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const locations = await prisma.location.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(locations)
  } catch (e) {
    console.error('List locations error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
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
    const imageUrl =
      typeof body.imageUrl === 'string' && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null

    const location = await prisma.location.create({
      data: { nameEn, nameAr, imageUrl },
    })
    return NextResponse.json(location)
  } catch (e) {
    console.error('Create location error:', e)
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 },
    )
  }
}
