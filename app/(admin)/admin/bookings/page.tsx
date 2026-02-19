import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminBookingsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <p className="mt-2 text-muted-foreground">Coming in Phase 5.</p>
    </div>
  )
}
