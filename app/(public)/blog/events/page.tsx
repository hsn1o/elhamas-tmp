import { getEvents } from '@/lib/db'
import { EventsPageClient } from './page-client'

export const metadata = {
  title: 'Events',
  description: 'Upcoming events and activities.',
}

export default async function EventsPage() {
  const events = await getEvents()
  return <EventsPageClient events={events} />
}
