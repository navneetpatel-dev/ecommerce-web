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
