import { notFound } from "next/navigation";
import { getBlogPost } from "../constants/siteContent";
import { BlogDetailView } from "../components/BlogDetailView.component";

interface BlogDetailPageProps {
  slug: string;
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const post = getBlogPost(slug);
  if (!post) notFound();
  return (
    <BlogDetailView
      title={post.title}
      body={post.body}
      excerpt={post.excerpt}
    />
  );
}
