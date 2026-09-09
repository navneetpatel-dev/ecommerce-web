/**
 * Ink & Brass Help Centre — lookup helpers.
 */

import type {
  HelpArticle,
  HelpCategory,
  HelpCategoryId,
  HelpSection,
} from "../../types/help/help.types";
import { HELP_CATEGORIES } from "../../constants/helpCategories";

export function getAllArticles(): HelpArticle[] {
  return HELP_CATEGORIES.flatMap((category) => category.articles);
}

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getCategoryById(id: HelpCategoryId): HelpCategory | undefined {
  return HELP_CATEGORIES.find((category) => category.id === id);
}

function sectionMatchesQuery(
  section: HelpSection,
  normalized: string,
): boolean {
  if (section.heading.toLowerCase().includes(normalized)) return true;
  if (section.paragraphs?.some((p) => p.toLowerCase().includes(normalized))) {
    return true;
  }
  if (section.bullets?.some((b) => b.toLowerCase().includes(normalized))) {
    return true;
  }
  return false;
}

export function searchHelp(query: string): HelpArticle[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getAllArticles().filter((article) => {
    if (article.title.toLowerCase().includes(normalized)) return true;
    if (article.summary.toLowerCase().includes(normalized)) return true;
    return article.sections.some((section) =>
      sectionMatchesQuery(section, normalized),
    );
  });
}
