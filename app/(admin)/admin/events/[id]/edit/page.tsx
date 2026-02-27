import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { EventFormPage } from '@/components/admin/EventFormPage'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <EventFormPage mode="edit" eventId={id} />
    </div>
  )
}
