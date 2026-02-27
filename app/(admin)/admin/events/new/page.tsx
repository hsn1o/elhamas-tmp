import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { EventFormPage } from '@/components/admin/EventFormPage'

export default async function NewEventPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <EventFormPage mode="create" />
    </div>
  )
}
