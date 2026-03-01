import { BlogPageClient } from './page-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Our Blog',
  description: 'Articles and tips for your journey.',
}

export default function BlogPage() {
  return <BlogPageClient />
}
