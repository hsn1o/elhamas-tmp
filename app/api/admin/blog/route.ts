import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const list = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("List blog posts error:", e);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let n = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${baseSlug}-${++n}`;
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const titleEn = typeof body.titleEn === "string" ? body.titleEn.trim() : "";
    const titleAr = typeof body.titleAr === "string" ? body.titleAr.trim() : "";
    const slugInput = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!titleEn || !titleAr) {
      return NextResponse.json(
        { error: "Title (EN) and Title (AR) are required" },
        { status: 400 }
      );
    }
    const baseSlug = slugInput ? slugify(slugInput) : slugify(titleEn);
    if (!baseSlug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }
    const finalSlug = await ensureUniqueSlug(baseSlug);
    const placeEn = typeof body.placeEn === "string" && body.placeEn.trim() ? body.placeEn.trim() : null;
    const placeAr = typeof body.placeAr === "string" && body.placeAr.trim() ? body.placeAr.trim() : null;
    const excerptEn = typeof body.excerptEn === "string" && body.excerptEn.trim() ? body.excerptEn.trim() : null;
    const excerptAr = typeof body.excerptAr === "string" && body.excerptAr.trim() ? body.excerptAr.trim() : null;
    const contentEn = typeof body.contentEn === "string" && body.contentEn.trim() ? body.contentEn.trim() : null;
    const contentAr = typeof body.contentAr === "string" && body.contentAr.trim() ? body.contentAr.trim() : null;
    const imageUrl = typeof body.imageUrl === "string" && body.imageUrl.trim() ? body.imageUrl.trim() : null;
    const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : null;
    const tags = Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean) : [];
    const isPublished = Boolean(body.isPublished);
    const publishedAt = body.publishedAt ? new Date(body.publishedAt) : isPublished ? new Date() : null;

    const item = await prisma.blogPost.create({
      data: {
        titleEn,
        titleAr,
        slug: finalSlug,
        placeEn,
        placeAr,
        excerptEn,
        excerptAr,
        contentEn,
        contentAr,
        imageUrl,
        category,
        tags,
        isPublished,
        publishedAt,
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.error("Create blog post error:", e);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
