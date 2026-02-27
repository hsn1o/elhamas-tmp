'use client'

import { HeroSection } from '@/components/sections/hero'
import { PartnersSection } from '@/components/sections/partners'
import { FeaturesSection } from '@/components/sections/features'
import { FeaturedPackagesSection } from '@/components/sections/featured-packages'
import { FeaturedHotelsSection } from '@/components/sections/featured-hotels'
import { WhyUsSection } from '@/components/sections/why-us'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { BlogPreviewSection } from '@/components/sections/blog-preview'
import { CTASection } from '@/components/sections/cta'
import { ContactFormSection } from '@/components/sections/contact-form'
import type { Hotel, TourPackage, Testimonial, BlogPost } from '@/lib/db'
import { DestinationsSection } from '@/components/sections/destinations'
import { AboutSection } from '@/components/sections/about'

interface HomePageClientProps {
  hotels: Hotel[]
  packages: TourPackage[]
  testimonials: Testimonial[]
  blogPosts: BlogPost[]
}

export function HomePageClient({ hotels, packages, testimonials, blogPosts }: HomePageClientProps) {
  return (
    <>
      <HeroSection />
      <DestinationsSection />
      <FeaturedPackagesSection packages={packages} />
      <BlogPreviewSection posts={blogPosts} />
      <AboutSection/>
      <TestimonialsSection testimonials={testimonials} />
      <ContactFormSection />
      {/* <PartnersSection />
      <FeaturesSection /> */}
      {/* <FeaturedHotelsSection hotels={hotels} /> */}
      {/* <WhyUsSection /> */}
      {/* <CTASection /> */}
    </>
  )
}
