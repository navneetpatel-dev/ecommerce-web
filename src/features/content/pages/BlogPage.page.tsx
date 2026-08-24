import { blogPosts } from "../constants/siteContent";
import { BlogListView } from "../components/BlogListView.component";

export function BlogPage() {
  return <BlogListView posts={blogPosts} />;
}
