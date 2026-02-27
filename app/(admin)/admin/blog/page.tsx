import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminBlogClient } from '@/components/admin/AdminBlogClient'

export default async function AdminBlogPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <AdminBlogClient />
    </div>
  )
}
