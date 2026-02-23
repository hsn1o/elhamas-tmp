import { notFound } from 'next/navigation'
import { getTourPackageById } from '@/lib/db'
import { PackageDetailClient } from './page-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pkg = await getTourPackageById(id)
  if (!pkg) return { title: 'Package Not Found' }
  return {
    title: pkg.name_en || pkg.name_ar || 'Tour Package',
    description: pkg.short_description_en || pkg.short_description_ar || pkg.description_en || pkg.description_ar || undefined,
  }
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pkg = await getTourPackageById(id)
  if (!pkg) notFound()
  return <PackageDetailClient package={pkg} />
}
