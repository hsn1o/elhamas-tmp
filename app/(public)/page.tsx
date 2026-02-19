import { getHotels, getTourPackages, getTestimonials, getBlogPosts } from '@/lib/db'
import { HomePageClient } from './page-client'

export default async function HomePage() {
  const [hotels, packages, testimonials, blogPosts] = await Promise.all([
    getHotels(true),
    getTourPackages(true),
    getTestimonials(),
    getBlogPosts(3),
  ])

  return (
    <HomePageClient
      hotels={hotels}
      packages={packages}
      testimonials={testimonials}
      blogPosts={blogPosts}
    />
  )
}
