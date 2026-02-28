import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function ensureAuth() {
  const session = await getSession()
  if (!session) return null
  return session
}

export async function GET() {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const row = await (prisma as { packageDiscoverCard?: { findFirst: () => Promise<{ id: string; titleEn: string; titleAr: string; imageUrl: string | null; isVisible: boolean } | null> } }).packageDiscoverCard?.findFirst()
    if (!row) {
      return NextResponse.json(null)
    }
    return NextResponse.json({
      id: row.id,
      titleEn: row.titleEn,
      titleAr: row.titleAr,
      imageUrl: row.imageUrl ?? null,
      isVisible: row.isVisible,
    })
  } catch (e) {
    console.error('Get package discover card error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch discover card' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  const session = await ensureAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const titleEn =
      typeof body.titleEn === 'string' ? body.titleEn.trim() : 'Discover Saudi Arabia'
    const titleAr =
      typeof body.titleAr === 'string' ? body.titleAr.trim() : 'اكتشف السعودية'
    const imageUrl =
      body.imageUrl === null || body.imageUrl === ''
        ? null
        : typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : undefined
    const isVisible = body.isVisible !== undefined ? Boolean(body.isVisible) : undefined

    const pkgDiscover = prisma as {
      packageDiscoverCard?: {
        findFirst: () => Promise<{ id: string } | null>
        update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<{ id: string; titleEn: string; titleAr: string; imageUrl: string | null; isVisible: boolean }>
        create: (args: { data: Record<string, unknown> }) => Promise<{ id: string; titleEn: string; titleAr: string; imageUrl: string | null; isVisible: boolean }>
      }
    }
    const existing = await pkgDiscover.packageDiscoverCard?.findFirst()

    let row
    if (existing && pkgDiscover.packageDiscoverCard) {
      row = await pkgDiscover.packageDiscoverCard.update({
        where: { id: existing.id },
        data: {
          ...(titleEn !== undefined && { titleEn }),
          ...(titleAr !== undefined && { titleAr }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(isVisible !== undefined && { isVisible }),
        },
      })
    } else if (pkgDiscover.packageDiscoverCard) {
      row = await pkgDiscover.packageDiscoverCard.create({
        data: {
          titleEn,
          titleAr,
          imageUrl: imageUrl ?? null,
          isVisible: isVisible ?? true,
        },
      })
    }

    if (!row) {
      return NextResponse.json(
        { error: 'Package discover card model not available. Run: npx prisma generate' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      id: row.id,
      titleEn: row.titleEn,
      titleAr: row.titleAr,
      imageUrl: row.imageUrl ?? null,
      isVisible: row.isVisible,
    })
  } catch (e) {
    console.error('Update package discover card error:', e)
    return NextResponse.json(
      { error: 'Failed to update discover card' },
      { status: 500 },
    )
  }
}
