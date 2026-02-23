import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TourPackageFormPage } from '@/components/admin/TourPackageFormPage'

export default async function NewPackagePage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <TourPackageFormPage mode="create" />
    </div>
  )
}
