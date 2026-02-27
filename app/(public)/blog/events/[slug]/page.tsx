import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/db'
import { EventDetailClient } from './page-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Event Not Found' }
  return {
    title: event.title_en || event.title_ar || 'Event',
    description: event.short_description_en || event.short_description_ar || undefined,
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()
  return <EventDetailClient event={event} />
}
