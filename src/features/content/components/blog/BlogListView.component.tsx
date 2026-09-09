import Link from "next/link";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { blogListViewStyles as styles } from "./blogListView.styles";

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
    <div className={styles.container}>
      <h1 className={styles.heading}>Blog</h1>
      <div className={styles.grid}>
        {posts.map((post) => (
          <article key={post.slug} className={styles.card}>
            <div className={styles.thumbnail} />
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <Link
              className={styles.readMoreLink}
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
