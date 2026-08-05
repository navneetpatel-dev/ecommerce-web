import { formatBlogTitle } from '../data/content'
import { BlogDetailView } from '../components/BlogDetailView'

interface BlogDetailPageProps {
  slug: string
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  return <BlogDetailView title={formatBlogTitle(slug)} />
}
