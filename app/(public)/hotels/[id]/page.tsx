import { notFound } from 'next/navigation'
import { getHotelById } from '@/lib/db'
import { HotelDetailClient } from './page-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const hotel = await getHotelById(id)
  if (!hotel) return { title: 'Hotel Not Found' }
  return {
    title: hotel.name_en || hotel.name_ar || 'Hotel',
    description: hotel.description_en || hotel.description_ar || undefined,
  }
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const hotel = await getHotelById(id)
  if (!hotel) notFound()
  return <HotelDetailClient hotel={hotel} />
}
