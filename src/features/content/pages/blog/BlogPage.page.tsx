import { blogPosts } from "../../constants/site/siteContent";
import { BlogListView } from "../../components/blog/BlogListView.component";

export function BlogPage() {
  return <BlogListView posts={blogPosts} />;
}
