import { getTourPackages, getPackageCategories, getLocations } from '@/lib/db'
import { PackagesPageClient } from './page-client'

export const metadata = {
  title: 'Tour Packages',
  description: 'Explore our comprehensive Hajj and Umrah packages designed for a meaningful spiritual journey.',
}

export default async function PackagesPage() {
  const [packages, categories, locations] = await Promise.all([
    getTourPackages(),
    getPackageCategories(),
    getLocations(),
  ])
  return (
    <PackagesPageClient
      packages={packages}
      categories={categories}
      locations={locations}
    />
  )
}
