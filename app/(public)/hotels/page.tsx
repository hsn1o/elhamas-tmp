import { getHotels } from '@/lib/db'
import { HotelsPageClient } from './page-client'

export const metadata = {
  title: 'Premium Hotels',
  description: 'Discover our premium hotel accommodations near the holy sites in Makkah and Madinah.',
}

export default async function HotelsPage() {
  const hotels = await getHotels()
  return <HotelsPageClient hotels={hotels} />
}
