import { notFound } from "next/navigation";
import { getVisaById } from "@/lib/db";
import { VisaDetailClient } from "./page-client";

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getVisaById(id);
  if (!item) return { title: "Visa Not Found" };
  return {
    title: item.name_en || item.name_ar || "Visa",
    description: item.description_en || item.description_ar || undefined,
  };
}

export default async function VisaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getVisaById(id);
  if (!item) notFound();
  return <VisaDetailClient item={item} />;
}
