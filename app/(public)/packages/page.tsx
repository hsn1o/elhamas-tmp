import { getTourPackages, getPackageCategories, getLocations, getPackageDiscoverCard } from '@/lib/db'
import { PackagesPageClient } from './page-client'

export const metadata = {
  title: 'Tour Packages',
  description: 'Explore our comprehensive Hajj and Umrah packages designed for a meaningful spiritual journey.',
}

export default async function PackagesPage() {
  const [packages, categories, locations, discoverCard] = await Promise.all([
    getTourPackages(),
    getPackageCategories(),
    getLocations(),
    getPackageDiscoverCard(),
  ])
  return (
    <PackagesPageClient
      packages={packages}
      categories={categories}
      locations={locations}
      discoverCard={discoverCard}
    />
  )
}
