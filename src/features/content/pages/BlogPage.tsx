import { blogPosts } from '../data/content'
import { BlogListView } from '../components/BlogListView'

export function BlogPage() {
  return <BlogListView posts={blogPosts} />
}
