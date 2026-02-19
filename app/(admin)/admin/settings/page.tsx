import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminSettingsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <p className="mt-2 text-muted-foreground">Coming in Phase 2.</p>
    </div>
  )
}
