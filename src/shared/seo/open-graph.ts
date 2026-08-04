import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'
import { SITE } from './constants'
import type { ProductSeoData } from './types'
import { productCanonical } from './canonical'

export function ogDefaults(): OpenGraph {
  return {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  }
}

export function productOg(product: ProductSeoData): OpenGraph {
  return {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: product.name,
    description: product.description,
    url: productCanonical(product.slug),
    images: product.imageUrl
      ? [{ url: product.imageUrl, width: 800, height: 800, alt: product.name }]
      : undefined,
  }
}
