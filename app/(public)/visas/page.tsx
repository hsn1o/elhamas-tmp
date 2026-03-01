import { getVisas } from "@/lib/db";
import { VisasPageClient } from "./page-client";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Issuing Visas",
  description: "Visa services for Umrah, Hajj, and travel.",
};

export default async function VisasPage() {
  const items = await getVisas();
  return <VisasPageClient items={items} />;
}
