import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminEventsClient } from '@/components/admin/AdminEventsClient'

export default async function AdminEventsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <AdminEventsClient />
    </div>
  )
}
