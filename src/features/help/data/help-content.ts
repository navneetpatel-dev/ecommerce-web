/**
 * Ink & Brass Help Centre — public entry point.
 * Content lives in topic files; this barrel preserves the original API.
 */

export type {
  HelpCategoryId,
  HelpSection,
  HelpArticle,
  HelpCategory,
  HelpQuickLink,
} from "./help-types";

export { HELP_CATEGORIES } from "./help-categories";
export { HELP_QUICK_LINKS } from "./quick-links";
export {
  getAllArticles,
  getArticleBySlug,
  getCategoryById,
  searchHelp,
} from "./help-helpers";
