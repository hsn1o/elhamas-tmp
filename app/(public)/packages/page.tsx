import { getTourPackages } from '@/lib/db'
import { PackagesPageClient } from './page-client'

export const metadata = {
  title: 'Tour Packages',
  description: 'Explore our comprehensive Hajj and Umrah packages designed for a meaningful spiritual journey.',
}

export default async function PackagesPage() {
  const packages = await getTourPackages()
  return <PackagesPageClient packages={packages} />
}
