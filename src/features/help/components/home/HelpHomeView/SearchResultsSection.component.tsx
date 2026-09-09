"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { HelpArticle } from "../../../types/help/help.types";
import { helpHomeViewStyles as styles } from "./helpHomeView.styles";

type Props = {
  query: string;
  results: HelpArticle[];
};

export function SearchResultsSection({ query, results }: Props) {
  const resultCountLabel =
    results.length === 1
      ? LABELS.helpSearchResultSingular
      : LABELS.helpSearchResultPlural;
  const resultCountMessage = formatLabel(resultCountLabel, {
    count: String(results.length),
    query: query.trim(),
  });
  const hasResults = results.length > 0;
  const resultElements = results.map((article) => (
    <li key={article.slug}>
      <Link
        href={`${PATHS.help}/${article.slug}`}
        className={styles.searchResultLink}
      >
        <div className={styles.searchResultContent}>
          <p className={styles.searchResultTitle}>{article.title}</p>
          <p className={styles.searchResultSummary}>{article.summary}</p>
        </div>
        <ChevronRight size={16} className={styles.searchResultChevron} />
      </Link>
    </li>
  ));
  const resultsList = hasResults ? (
    <ul className={styles.searchResultsList}>{resultElements}</ul>
  ) : (
    <p className={styles.searchResultsEmpty}>{LABELS.helpSearchEmpty}</p>
  );

  return (
    <section className={styles.searchResultsSection}>
      <div className={styles.searchResultsHeader}>
        <p className={styles.searchResultsCount}>{resultCountMessage}</p>
      </div>
      {resultsList}
    </section>
  );
}
