import { getBlogPosts } from '@/lib/db'
import { ArticlesPageClient } from './page-client'

export const metadata = {
  title: 'Articles',
  description: 'Browse all articles and travel tips.',
}

export default async function ArticlesPage() {
  const articles = await getBlogPosts()
  return <ArticlesPageClient articles={articles} />
}
