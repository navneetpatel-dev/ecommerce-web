// Content feature — public API
//
// Owns the static and editorial storefront content: static legal/info pages
// (About, Terms, Privacy, Contact, Maintenance, Returns policy), the blog
// listing and article detail pages, their presentational views, the contact
// form hook, and the content data source. These pages are rendered directly
// by the storefront routes.
export { AboutPage } from "./pages/about/AboutPage.page";
export { TermsPage } from "./pages/legal/TermsPage.page";
export { PrivacyPage } from "./pages/legal/PrivacyPage.page";
export { ContactPage } from "./pages/contact/ContactPage.page";
export { MaintenancePage } from "./pages/maintenance/MaintenancePage.page";
export { ReturnsPage } from "./pages/legal/ReturnsPage.page";
export { BlogPage } from "./pages/blog/BlogPage.page";
export { BlogDetailPage } from "./pages/blog/BlogDetailPage.page";
export { getBlogPost, blogPosts } from "./constants/site/siteContent";
