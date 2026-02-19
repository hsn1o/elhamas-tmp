import { getTransportation } from '@/lib/db'
import { TransportationPageClient } from './page-client'

export const metadata = {
  title: 'Transportation',
  description: 'Premium transportation services for comfortable travel between holy sites.',
}

export default async function TransportationPage() {
  const transportation = await getTransportation()
  return <TransportationPageClient transportation={transportation} />
}
