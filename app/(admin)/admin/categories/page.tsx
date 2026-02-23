import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CategoriesPageClient } from './page-client'

export const metadata = {
  title: 'Package Categories',
  description: 'Manage package categories',
}

export default async function AdminCategoriesPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <CategoriesPageClient />
    </div>
  )
}
