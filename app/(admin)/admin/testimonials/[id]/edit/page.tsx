import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TestimonialFormPage } from '@/components/admin/TestimonialFormPage'

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <TestimonialFormPage mode="edit" testimonialId={id} />
    </div>
  )
}
