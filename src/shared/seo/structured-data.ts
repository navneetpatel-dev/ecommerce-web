import { SITE } from "./constants";
import { productCanonical } from "./canonical";
import type { ProductSeoData, BreadcrumbItem, FaqQuestion } from "./types";

type WithContext<T> = T & { "@context": "https://schema.org" };

export function generateOrganizationSchema(): WithContext<{
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon-512.png`,
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
      price: product.basePrice,
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
