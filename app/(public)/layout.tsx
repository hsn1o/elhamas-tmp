'use client'

import React from "react"

import { I18nProvider } from '@/lib/i18n'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider defaultLocale="ar">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
