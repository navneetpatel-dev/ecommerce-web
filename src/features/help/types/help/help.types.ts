/**
 * Ink & Brass Help Centre — shared content types.
 * Plain TypeScript data only (no React).
 */

export type HelpCategoryId =
  | "getting-started"
  | "account-security"
  | "orders-tracking"
  | "shipping-delivery"
  | "returns-refunds"
  | "payments"
  | "products-reviews"
  | "selling"
  | "privacy-data"
  | "troubleshooting";

export type HelpSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  sections: HelpSection[];
  relatedSlugs: string[];
};

export type HelpCategory = {
  id: HelpCategoryId;
  title: string;
  description: string;
  /** Lucide icon component name */
  icon: string;
  articles: HelpArticle[];
};

export type HelpQuickLink = {
  label: string;
  href: string;
  description: string;
};
