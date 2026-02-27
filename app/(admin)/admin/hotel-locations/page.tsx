import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { HotelLocationsPageClient } from './page-client'

export const metadata = {
  title: 'Places',
  description: 'Manage places (e.g. Mecca, Medina) for filtering hotels on the hotels page.',
}

export default async function AdminHotelLocationsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <HotelLocationsPageClient />
    </div>
  )
}
