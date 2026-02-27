import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminTransportationClient } from '@/components/admin/AdminTransportationClient'

export default async function AdminTransportationPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <AdminTransportationClient />
    </div>
  )
}
