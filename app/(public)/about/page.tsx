import { getTestimonials } from '@/lib/db'
import { AboutPageClient } from './page-client'

export const metadata = {
  title: 'About Us',
  description: 'Your trusted partner for sacred journeys.',
}

export default async function AboutPage() {
  const testimonials = await getTestimonials()
  return <AboutPageClient testimonials={testimonials} />
}
