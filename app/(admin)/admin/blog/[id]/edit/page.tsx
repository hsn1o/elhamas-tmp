import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BlogFormPage } from '@/components/admin/BlogFormPage'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <BlogFormPage mode="edit" postId={id} />
    </div>
  )
}
