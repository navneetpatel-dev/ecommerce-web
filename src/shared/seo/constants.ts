export const SITE = {
  name: "E-Commerce Marketplace",
  shortName: "Marketplace",
  description: "Multi-vendor e-commerce platform",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5173",
  ogImage: "/og-image.png",
  locale: "en_IN",
  twitter: "@marketplace",
  author: "Marketplace",
} as const;

/**
 * Centralized per-route SEO copy (Rule 8 / Rule 27): every indexable page's
 * title and description come from here, never hardcoded in route files.
 */
export const SEO_PAGE_COPY = {
  home: {
    title: "Premium T-Shirts Online",
    description:
      "Shop premium t-shirts from verified sellers with fast delivery and easy returns.",
  },
  products: {
    title: "All Products",
    description:
      "Browse every product across the marketplace — filter by category, price, and rating.",
  },
  categories: {
    title: "Categories",
    description:
      "Explore product categories across the marketplace, from essentials to limited drops.",
  },
  vendors: {
    title: "Vendors",
    description:
      "Meet the verified sellers behind the marketplace — browse shops and their catalogs.",
  },
  blog: {
    title: "Blog",
    description:
      "Guides and stories on style, selling, and shopping from the marketplace team.",
  },
  about: {
    title: "About Us",
    description:
      "Learn about the marketplace mission: connecting independent sellers with shoppers.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with the marketplace team for support, partnerships, or feedback.",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How the marketplace collects, uses, and protects your personal information.",
  },
  terms: {
    title: "Terms of Service",
    description: "The terms that govern your use of the marketplace platform.",
  },
  returns: {
    title: "Returns & Refunds",
    description:
      "Return policies, timelines, and refund processing for marketplace orders.",
  },
  help: {
    title: "Help Center",
    description:
      "Guides for orders, shipping, returns, payments, and your account on our marketplace.",
  },
} as const;

/**
 * Titles for authenticated workspace routes (Rule 27). These pages are
 * never indexable; metadata exists so every route exports a title and a
 * noindex robots directive from one centralized source.
 */
export const WORKSPACE_PAGE_COPY = {
  "/admin": { title: "Admin console" },
  "/admin/audit": { title: "Audit log" },
  "/admin/banners": { title: "Promo banners" },
  "/admin/bug-reports": { title: "Bug reports" },
  "/admin/bug-reports/[id]": { title: "Bug report detail" },
  "/admin/categories": { title: "Categories" },
  "/admin/finance": { title: "Finance" },
  "/admin/orders": { title: "Orders" },
  "/admin/reports": { title: "Reports" },
  "/admin/returns": { title: "Returns" },
  "/admin/reviews": { title: "Reviews" },
  "/admin/shipping": { title: "Shipping" },
  "/admin/support-tickets": { title: "Support tickets" },
  "/admin/support-tickets/[id]": { title: "Support ticket detail" },
  "/admin/tax": { title: "Tax rules" },
  "/admin/users": { title: "Users" },
  "/admin/vendors": { title: "Vendors" },
  "/support/bug-reports": { title: "My bug reports" },
  "/support/bug-reports/[id]": { title: "Bug report detail" },
  "/support/bug-reports/new": { title: "Report a bug" },
  "/support/tickets": { title: "My support tickets" },
  "/support/tickets/[id]": { title: "Support ticket detail" },
  "/support/tickets/new": { title: "New support ticket" },
  "/vendor": { title: "Vendor workspace" },
  "/vendor/dashboard/bug-reports": { title: "Vendor bug reports" },
  "/vendor/dashboard/bug-reports/[id]": { title: "Vendor bug report detail" },
  "/vendor/dashboard/bug-reports/new": { title: "Report a bug" },
  "/vendor/dashboard/coupons": { title: "Vendor coupons" },
  "/vendor/dashboard/reports": { title: "Vendor reports" },
  "/vendor/dashboard/reviews": { title: "Vendor reviews" },
  "/vendor/dashboard/support-tickets": { title: "Vendor support tickets" },
  "/vendor/dashboard/support-tickets/[id]": {
    title: "Vendor support ticket detail",
  },
} as const;

/**
 * Static public routes for sitemap generation (Rule 27). The sitemap is
 * derived from this single list — the same source of truth as navigation —
 * never a hand-maintained copy. Dynamic routes (products, blog articles)
 * are appended by `app/sitemap.ts` from their live data sources.
 */
export const PUBLIC_SITEMAP_ROUTES: {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.8 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.7 },
  { path: "/vendors", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/help", changeFrequency: "monthly", priority: 0.5 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];
