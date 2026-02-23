import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminPackagesClient } from '@/components/admin/AdminPackagesClient'

export default async function AdminPackagesPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <AdminPackagesClient />
    </div>
  )
}
