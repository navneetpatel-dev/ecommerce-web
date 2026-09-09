import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { HelpArticle } from "../../types/help/help.types";
import { helpArticleViewStyles as styles } from "../../styles/article/helpArticleView.styles";

interface HelpRelatedArticlesProps {
  related: HelpArticle[];
}

/** "Related articles" list shown at the end of an article body. */
export function HelpRelatedArticles({ related }: HelpRelatedArticlesProps) {
  const relatedItemElements = related.map((item) => (
    <li key={item.slug}>
      <Link href={`${PATHS.help}/${item.slug}`} className={styles.relatedLink}>
        {item.title}
        <ChevronRight size={14} className={styles.relatedChevron} />
      </Link>
    </li>
  ));

  return (
    <aside className={styles.aside}>
      <TextEyebrow>{LABELS.helpRelatedEyebrow}</TextEyebrow>
      <ul className={styles.relatedList}>{relatedItemElements}</ul>
    </aside>
  );
}
