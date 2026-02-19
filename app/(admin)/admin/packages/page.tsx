import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPackagesPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Tour Packages</h1>
      <p className="mt-2 text-muted-foreground">Coming in Phase 3.</p>
    </div>
  )
}
