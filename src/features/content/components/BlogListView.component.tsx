import Link from "next/link";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
}

interface BlogListViewProps {
  posts: readonly BlogPost[];
}

export function BlogListView({ posts }: BlogListViewProps) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">Blog</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-md border border-line bg-surface p-4"
          >
            <div className="aspect-[16/9] rounded-sm bg-brand-subtle mb-4" />
            <h2 className="text-[1.125rem] font-semibold text-ink">
              {post.title}
            </h2>
            <p className="text-body text-ink-muted mt-2">{post.excerpt}</p>
            <Link
              className="inline-flex mt-3 text-body-sm text-brand hover:underline"
              href={PATHS.blogPost(post.slug)}
            >
              {LABELS.readArticle}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
