import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TestimonialFormPage } from '@/components/admin/TestimonialFormPage'

export default async function NewTestimonialPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <TestimonialFormPage mode="create" />
    </div>
  )
}
