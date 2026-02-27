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
    const existing = await prisma.packageCategory.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const body = await request.json()
    const nameEn =
      typeof body.nameEn === 'string' ? body.nameEn.trim() : existing.nameEn
    const nameAr =
      typeof body.nameAr === 'string' ? body.nameAr.trim() : existing.nameAr

    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: 'Name (EN) and Name (AR) are required' },
        { status: 400 },
      )
    }

    const category = await prisma.packageCategory.update({
      where: { id },
      data: { nameEn, nameAr },
    })
    return NextResponse.json(category)
  } catch (e) {
    console.error('Update category error:', e)
    return NextResponse.json(
      { error: 'Failed to update category' },
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
    const existing = await prisma.packageCategory.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    await prisma.packageCategory.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Delete category error:', e)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 },
    )
  }
}
