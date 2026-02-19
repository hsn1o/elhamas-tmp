'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import type { AdminUserSession } from '@/lib/auth'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayoutClient({
  session,
  children,
}: {
  session: AdminUserSession | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const didRedirect = useRef(false)

  useEffect(() => {
    if (didRedirect.current) return
    const isLoginPage = pathname === '/admin/login'
    if (!session && !isLoginPage) {
      didRedirect.current = true
      router.replace('/admin/login')
      return
    }
    if (session && isLoginPage) {
      didRedirect.current = true
      router.replace('/admin')
    }
  }, [session, pathname, router])

  const isLoginPage = pathname === '/admin/login'
  if (!session && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Redirecting to login…</p>
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={session!} />
      <main className="flex-1 overflow-auto bg-muted/20">
        {children}
      </main>
    </div>
  )
}
