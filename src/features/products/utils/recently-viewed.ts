import type { ProductListItem } from '@/shared/api/types'
import { toProductListItem } from './productListItem'

const RECENT_KEY = 'recently-viewed-products'

export function trackRecentlyViewed(
  product: Parameters<typeof toProductListItem>[0],
) {
  if (typeof window === 'undefined') return

  const productSnapshot = toProductListItem(product)

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
