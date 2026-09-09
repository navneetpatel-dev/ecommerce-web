import { contentDocStyles as styles } from "../legal/contentDoc.styles";

interface BlogDetailViewProps {
  title: string;
  body: string;
  excerpt?: string;
}

export function BlogDetailView({ title, body, excerpt }: BlogDetailViewProps) {
  return (
    <article className={styles.blogArticleContainer}>
      <h1 className={styles.h1Display}>{title}</h1>
      <p className={styles.blogMeta}>Marketplace Editorial</p>
      {excerpt && <p className={styles.blogExcerpt}>{excerpt}</p>}
      <p className={styles.blogBody}>{body}</p>
    </article>
  );
}
