'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import type { AdminUserSession } from '@/lib/auth'
import { AdminSidebar } from './AdminSidebar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

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
      {/* Desktop sidebar - hidden on small screens */}
      <AdminSidebar
        user={session!}
        className="hidden md:flex shrink-0"
      />
      {/* Mobile header + main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">Admin</span>
        </header>
        <main className="flex-1 overflow-auto bg-muted/20">
          {children}
        </main>
      </div>
      {/* Mobile sidebar drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-56 p-0 gap-0 border-r"
        >
          <AdminSidebar
            user={session!}
            onNavigate={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
