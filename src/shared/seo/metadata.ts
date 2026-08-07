import type { Metadata } from 'next'
import { SITE } from './constants'
import { productCanonical, categoryCanonical, canonicalUrl } from './canonical'
import { productOg, ogDefaults } from './open-graph'
import type { ProductSeoData, CategorySeoData } from './types'

export function generateHomeMetadata(): Metadata {
  return {
    title: 'Premium T-Shirts Online',
    description: SITE.description,
    keywords: ['t-shirts', 'online shopping', 'premium clothing', 'fashion', 'e-commerce'],
    alternates: { canonical: SITE.url },
    openGraph: {
      ...ogDefaults(),
      title: 'Premium T-Shirts Online | E-Commerce Marketplace',
      url: SITE.url,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Premium T-Shirts Online | E-Commerce Marketplace',
      description: SITE.description,
      site: SITE.twitter,
      creator: SITE.twitter,
    },
  }
}

export function generateProductMetadata(product: ProductSeoData): Metadata {
  const title = `${product.name}`
  const description = product.description
    ? product.description.slice(0, 160).replace(/\s+/g, ' ').trim()
    : `Buy ${product.name} online at the best price. Fast delivery, easy returns.`

  return {
    title,
    description,
    keywords: [
      product.name,
      ...product.tags,
      product.category.name,
      product.vendor.businessName,
      't-shirts',
      'buy online',
      'e-commerce',
    ],
    alternates: { canonical: productCanonical(product.slug) },
    openGraph: {
      ...productOg(product),
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE.twitter,
      creator: SITE.twitter,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export function generateCategoryMetadata(
  category: CategorySeoData & {
    seoTitle?: string | null
    seoDescription?: string | null
    pathSlugs?: string[]
  },
  options: { noindex?: boolean } = {},
): Metadata {
  const slugs = category.pathSlugs?.length ? category.pathSlugs : [category.slug]
  const title = category.seoTitle?.trim() || category.name
  const description =
    category.seoDescription?.trim() ||
    `Shop ${category.name} online. Premium quality, fast delivery, and easy returns at ${SITE.name}.`
  const canonical = categoryCanonical(...slugs)

  return {
    title,
    description,
    keywords: [category.name, 'buy online', 'e-commerce', SITE.name],
    alternates: { canonical },
    robots: options.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      ...ogDefaults(),
      title: `${title} | ${SITE.name}`,
      description,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE.name}`,
      description,
      site: SITE.twitter,
    },
  }
}

export function generateStaticPageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      ...ogDefaults(),
      title: `${title} | ${SITE.name}`,
      description,
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${SITE.name}`,
      description,
      site: SITE.twitter,
    },
  }
}

export function generateNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  }
}
