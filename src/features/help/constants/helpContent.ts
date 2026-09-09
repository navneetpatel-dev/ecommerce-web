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
} from "../types/help/help.types";

export { HELP_CATEGORIES } from "./helpCategories";
export { HELP_QUICK_LINKS } from "./helpQuickLinks";
export {
  getAllArticles,
  getArticleBySlug,
  getCategoryById,
  searchHelp,
} from "../utils/search/helpSearch.utils";
