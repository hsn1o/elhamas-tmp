import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { VisaFormPage } from '@/components/admin/VisaFormPage'

export default async function EditVisaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <VisaFormPage mode="edit" visaId={id} />
    </div>
  )
}
