import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { SITE } from "./constants";
import type { ProductSeoData } from "./types";
import { productCanonical } from "./canonical";

export function ogDefaults(): OpenGraph {
  return {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  };
}

/**
 * Product Open Graph fields. Deliberately declares **no** `images`: the
 * `/products/[slug]` segment ships a generated 1200x630 `opengraph-image`, and
 * a declared image would compete with it (the raw catalogue photo is square, so
 * platforms cropped it).
 */
export function productOg(product: ProductSeoData): OpenGraph {
  return {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: product.name,
    description: product.description,
    url: productCanonical(product.slug),
  };
}
