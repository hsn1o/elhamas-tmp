import { notFound } from 'next/navigation'
import { getHotelById } from '@/lib/db'
import { RoomBookingPageClient } from './page-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>
}) {
  const { id, roomId } = await params
  const hotel = await getHotelById(id)
  const room = hotel?.rooms?.find((r) => r.id === roomId)
  if (!hotel || !room) {
    return {
      title: 'Room Not Found',
    }
  }
  return {
    title: `${room.name_en || room.name_ar || 'Room'} – ${
      hotel.name_en || hotel.name_ar || 'Hotel'
    }`,
    description:
      room.description_en ||
      room.description_ar ||
      hotel.description_en ||
      hotel.description_ar ||
      undefined,
  }
}

export default async function RoomBookingPage({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>
}) {
  const { id, roomId } = await params
  const hotel = await getHotelById(id)
  const room = hotel?.rooms?.find((r) => r.id === roomId)
  if (!hotel || !room) notFound()

  return <RoomBookingPageClient hotel={hotel} room={room} />
}

