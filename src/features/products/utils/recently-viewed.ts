import type { ProductListItem } from '@/shared/api/types'

const RECENT_KEY = 'recently-viewed-products'

export function trackRecentlyViewed(product: {
  id: string
  slug?: string
  name: string
  basePrice: number
  avgRating: number
  reviewCount: number
  imageUrl: string
  stock: number
  vendor: ProductListItem['vendor']
  compareAtPrice?: number
}) {
  if (typeof window === 'undefined') return

  const productSnapshot: ProductListItem = {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    basePrice: product.basePrice,
    avgRating: product.avgRating,
    reviewCount: product.reviewCount,
    imageUrl: product.imageUrl,
    stock: product.stock,
    vendor: product.vendor,
    compareAtPrice: product.compareAtPrice,
  }

  try {
    const current = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as ProductListItem[]
    const withoutCurrent = current.filter((item) => item.id !== productSnapshot.id)
    const next = [productSnapshot, ...withoutCurrent].slice(0, 12)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    localStorage.setItem(RECENT_KEY, JSON.stringify([productSnapshot]))
  }
}

export function getRecentlyViewedProducts(): ProductListItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as ProductListItem[]
  } catch {
    return []
  }
}
