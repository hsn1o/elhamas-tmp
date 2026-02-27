import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { HotelFormPage } from '@/components/admin/HotelFormPage'

export default async function NewHotelPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <HotelFormPage mode="create" />
    </div>
  )
}
