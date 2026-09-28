import { SITE } from "./constants";
import { productCanonical } from "./canonical";
import type { ProductSeoData, BreadcrumbItem, FaqQuestion } from "./types";

type WithContext<T> = T & { "@context": "https://schema.org" };

/** The marketplace, as a nested reference (publisher/parent organization). */
function marketplaceRef() {
  return {
    "@type": "Organization" as const,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon-512.png`,
  };
}

export function generateOrganizationSchema(): WithContext<{
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}> {
  return {
    "@context": "https://schema.org",
    ...marketplaceRef(),
    sameAs: [`https://twitter.com/${SITE.twitter.replace("@", "")}`],
  };
}

export function generateWebSiteSchema(): WithContext<{
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductSchema(product: ProductSeoData) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Product" as const,
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    url: productCanonical(product.slug),
    brand: {
      "@type": "Brand" as const,
      name: product.vendor.businessName,
    },
    offers: {
      "@type": "Offer" as const,
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: productCanonical(product.slug),
    },
    ...(product.avgRating > 0 && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating" as const,
            ratingValue: product.avgRating,
            reviewCount: product.reviewCount,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: item.href } : {}),
    })),
  };
}

export function generateFAQSchema(questions: FaqQuestion[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "FAQPage" as const,
    mainEntity: questions.map((q) => ({
      "@type": "Question" as const,
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: q.answer,
      },
    })),
  };
}

/**
 * Help-centre article. The pages are static and server-rendered, so the schema
 * describes exactly what is on the page (never marked up from client-only data).
 */
export function generateArticleSchema(article: {
  title: string;
  summary: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Article" as const,
    headline: article.title,
    description: article.summary,
    mainEntityOfPage: article.url,
    url: article.url,
    publisher: marketplaceRef(),
  };
}

/** A vendor's public storefront, published within the marketplace. */
export function generateStoreSchema(store: {
  name: string;
  url: string;
  description?: string | null;
  imageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Store" as const,
    name: store.name,
    url: store.url,
    ...(store.description ? { description: store.description } : {}),
    ...(store.imageUrl ? { image: store.imageUrl } : {}),
    parentOrganization: marketplaceRef(),
  };
}
