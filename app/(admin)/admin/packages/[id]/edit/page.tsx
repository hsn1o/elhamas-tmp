import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TourPackageFormPage } from '@/components/admin/TourPackageFormPage'

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <TourPackageFormPage mode="edit" packageId={id} />
    </div>
  )
}
