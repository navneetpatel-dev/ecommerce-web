import type { WishlistItem } from '@/shared/api/types'

export function hasPriceDropped(item: WishlistItem): boolean {
  return item.priceAtAdd > 0 && item.product.basePrice < item.priceAtAdd
}
