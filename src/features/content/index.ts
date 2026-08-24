// Content feature — public API
//
// Owns the static and editorial storefront content: static legal/info pages
// (About, Terms, Privacy, Contact, Maintenance, Returns policy), the blog
// listing and article detail pages, their presentational views, the contact
// form hook, and the content data source. These pages are rendered directly
// by the storefront routes.
export { AboutPage } from "./pages/AboutPage.page";
export { TermsPage } from "./pages/TermsPage.page";
export { PrivacyPage } from "./pages/PrivacyPage.page";
export { ContactPage } from "./pages/ContactPage.page";
export { MaintenancePage } from "./pages/MaintenancePage.page";
export { ReturnsPage } from "./pages/ReturnsPage.page";
export { BlogPage } from "./pages/BlogPage.page";
export { BlogDetailPage } from "./pages/BlogDetailPage.page";
export { getBlogPost, blogPosts } from "./constants/siteContent";
