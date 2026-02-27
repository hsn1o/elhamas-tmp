import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TransportationFormPage } from '@/components/admin/TransportationFormPage'

export default async function EditTransportationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <TransportationFormPage mode="edit" transportationId={id} />
    </div>
  )
}
