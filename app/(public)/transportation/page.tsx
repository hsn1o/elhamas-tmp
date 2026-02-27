import { getTransportation } from '@/lib/db'
import { TransportationPageClient } from './page-client'

export const metadata = {
  title: 'Transportation Services',
  description: 'Comfortable travel between holy sites. Browse vehicles and book your transfer.',
}

export default async function TransportationPage() {
  const items = await getTransportation()
  return <TransportationPageClient items={items} />
}
