"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import type { HelpCategory } from "../../../constants/helpContent";
import { CategoryIcon } from "./CategoryIcon.component";
import { helpHomeViewStyles as styles } from "./helpHomeView.styles";

export function CategoryCard({ category }: { category: HelpCategory }) {
  const articleElements = category.articles.map((article) => (
    <li key={article.slug}>
      <Link
        href={`${PATHS.help}/${article.slug}`}
        className={styles.articleLink}
      >
        <span className={styles.articleLinkTitle}>{article.title}</span>
        <ChevronRight size={14} className={styles.articleLinkChevron} />
      </Link>
    </li>
  ));

  return (
    <li className={styles.categoryCard}>
      <div className={styles.categoryCardTop}>
        <span className={styles.categoryIconBox}>
          <CategoryIcon name={category.icon} />
        </span>
        <div className={styles.categoryContent}>
          <h3 className={styles.categoryTitle}>{category.title}</h3>
          <p className={styles.categoryDesc}>{category.description}</p>
        </div>
      </div>
      <ul className={styles.articleList}>{articleElements}</ul>
    </li>
  );
}
