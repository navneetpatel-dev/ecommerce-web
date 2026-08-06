import { notFound } from 'next/navigation'
import { getBlogPost } from '../data/content'
import { BlogDetailView } from '../components/BlogDetailView'

interface BlogDetailPageProps {
  slug: string
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const post = getBlogPost(slug)
  if (!post) notFound()
  return <BlogDetailView title={post.title} body={post.body} excerpt={post.excerpt} />
}
