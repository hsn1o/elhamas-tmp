import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BlogFormPage } from '@/components/admin/BlogFormPage'

export default async function NewBlogPostPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <BlogFormPage mode="create" />
    </div>
  )
}
