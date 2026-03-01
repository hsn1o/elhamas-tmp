import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/db";
import { ArticleDetailClient } from "./page-client";

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.is_published) return { title: "Article Not Found" };
  return {
    title: post.title_en || post.title_ar || "Article",
    description: post.excerpt_en || post.excerpt_ar || undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.is_published) notFound();
  return <ArticleDetailClient post={post} />;
}
