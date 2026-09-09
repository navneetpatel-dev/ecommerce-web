import type { HelpArticle } from "../../types/help/help.types";
import { helpArticleViewStyles as styles } from "../../styles/article/helpArticleView.styles";

interface HelpArticleSectionProps {
  section: HelpArticle["sections"][number];
}

/** One heading + paragraphs + optional bullet list within an article body. */
export function HelpArticleSection({ section }: HelpArticleSectionProps) {
  const paragraphElements = section.paragraphs?.map((p) => (
    <p key={p.slice(0, 48)} className={styles.sectionParagraph}>
      {p}
    </p>
  ));
  const hasBullets = Boolean(section.bullets?.length);
  const bulletElements = section.bullets?.map((b) => (
    <li key={b.slice(0, 48)}>{b}</li>
  ));
  const bulletList = hasBullets ? (
    <ul className={styles.bulletList}>{bulletElements}</ul>
  ) : null;

  return (
    <section>
      <h2 className={styles.sectionHeading}>{section.heading}</h2>
      {paragraphElements}
      {bulletList}
    </section>
  );
}
