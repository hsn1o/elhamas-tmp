import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAuth() {
  const session = await getSession()
  if (!session) return null
  return session
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    const existing = await prisma.location.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const body = await request.json()
    const nameEn =
      typeof body.nameEn === 'string' ? body.nameEn.trim() : existing.nameEn
    const nameAr =
      typeof body.nameAr === 'string' ? body.nameAr.trim() : existing.nameAr
    const imageUrl =
      body.imageUrl !== undefined
        ? (typeof body.imageUrl === 'string' && body.imageUrl.trim()
            ? body.imageUrl.trim()
            : null)
        : existing.imageUrl

    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: 'Name (EN) and Name (AR) are required' },
        { status: 400 },
      )
    }

    const location = await prisma.location.update({
      where: { id },
      data: { nameEn, nameAr, imageUrl },
    })
    return NextResponse.json(location)
  } catch (e) {
    console.error('Update location error:', e)
    return NextResponse.json(
      { error: 'Failed to update location' },
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
    const existing = await prisma.location.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    await prisma.location.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Delete location error:', e)
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 },
    )
  }
}
