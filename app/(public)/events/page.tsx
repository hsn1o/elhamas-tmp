import { getEvents } from '@/lib/db'
import { EventsPageClient } from './page-client'

export const metadata = {
  title: 'Events',
  description: 'Join our special Islamic events, guided tours, and spiritual gatherings.',
}

export default async function EventsPage() {
  const events = await getEvents()
  return <EventsPageClient events={events} />
}
