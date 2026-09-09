/** Public surface for the help centre: help home, article pages, and
 * article lookup helpers backed by static topic content. */
export { HelpPage } from "./pages/home/HelpPage.page";
export { HelpArticlePage } from "./pages/article/HelpArticlePage.page";
export {
  HELP_CATEGORIES,
  getArticleBySlug,
  getAllArticles,
  searchHelp,
} from "./constants/helpContent";
export { HelpContactForm } from "./components/contact/HelpContactForm.component";
