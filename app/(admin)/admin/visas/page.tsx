import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminVisasClient } from '@/components/admin/AdminVisasClient'

export default async function AdminVisasPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <AdminVisasClient />
    </div>
  )
}
