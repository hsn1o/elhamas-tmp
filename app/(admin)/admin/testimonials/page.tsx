import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminTestimonialsClient } from '@/components/admin/AdminTestimonialsClient'

export default async function AdminTestimonialsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <AdminTestimonialsClient />
    </div>
  )
}
