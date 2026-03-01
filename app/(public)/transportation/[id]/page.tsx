import { notFound } from 'next/navigation'
import { getTransportationById } from '@/lib/db'
import { TransportationDetailClient } from './page-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getTransportationById(id)
  if (!item) return { title: 'Transportation Not Found' }
  return {
    title: item.name_en || item.name_ar || 'Transportation',
    description: item.description_en || item.description_ar || undefined,
  }
}

export default async function TransportationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getTransportationById(id)
  if (!item) notFound()
  return <TransportationDetailClient item={item} />
}
