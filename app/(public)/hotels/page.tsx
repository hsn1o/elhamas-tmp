import { getHotelLocations, getHotels } from '@/lib/db'
import { HotelsPageClient } from './page-client'

// Force dynamic rendering so places added in admin appear immediately
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Premium Hotels',
  description: 'Comfortable stays near the holy sites. Browse by location and find the best accommodation.',
}

export default async function HotelsPage() {
  const [locations, hotels] = await Promise.all([
    getHotelLocations(),
    getHotels(),
  ])
  return (
    <HotelsPageClient
      locations={locations}
      hotels={hotels}
    />
  )
}
