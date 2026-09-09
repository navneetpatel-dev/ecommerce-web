"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { LifeBuoy } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import {
  getAllArticles,
  getArticleBySlug,
  HELP_CATEGORIES,
} from "../../constants/helpContent";
import type { HelpArticle } from "../../types/help/help.types";
import { HelpArticleSection } from "./HelpArticleSection.component";
import { HelpRelatedArticles } from "./HelpRelatedArticles.component";
import { helpArticleViewStyles as styles } from "../../styles/article/helpArticleView.styles";

export function HelpArticleView({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className={styles.notFoundRoot}>
        <div aria-hidden className={styles.notFoundGlow} />
        <div className={styles.notFoundContainer}>
          <EmptyState
            icon={LifeBuoy}
            heading={LABELS.helpArticleNotFound}
            message={LABELS.helpArticleNotFoundMessage}
            actionLabel={LABELS.helpBackToCenter}
            actionTo={PATHS.help}
          />
        </div>
      </div>
    );
  }

  const category = HELP_CATEGORIES.find((c) =>
    c.articles.some((a) => a.slug === article.slug),
  );
  const related = article.relatedSlugs
    .map((s) => getAllArticles().find((a) => a.slug === s))
    .filter((a): a is HelpArticle => Boolean(a));

  const categoryEyebrow = category ? (
    <TextEyebrow brand>{category.title}</TextEyebrow>
  ) : null;
  const sectionElements = article.sections.map((section) => (
    <HelpArticleSection key={section.heading} section={section} />
  ));
  const hasRelated = related.length > 0;
  const relatedSection = hasRelated ? (
    <HelpRelatedArticles related={related} />
  ) : null;

  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.heroGlow} />

      <article className={styles.articleContainer}>
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className={styles.header}
        >
          <Link href={PATHS.help} className={styles.backLink}>
            <ArrowLeft className={styles.backArrow} strokeWidth={1.5} />
            {LABELS.helpCenter}
          </Link>
          {categoryEyebrow}
          <h1
            className={styles.title}
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            {article.title}
          </h1>
          <p className={styles.summary}>{article.summary}</p>
        </motion.header>

        <div className={styles.sectionsWrapper}>{sectionElements}</div>

        {relatedSection}

        <p className={styles.supportNotice}>
          {LABELS.helpStillNeedHelp}{" "}
          <Link href={`${PATHS.help}#contact`} className={styles.supportLink}>
            {LABELS.helpContactSupportLink}
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
