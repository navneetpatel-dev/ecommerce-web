import type { CartItem } from '@/shared/api/types'

export function groupItemsByVendor(items: CartItem[]): Record<string, CartItem[]> {
  // Preserve cart list order (first-seen vendor, then items in that sequence).
  return items.reduce<Record<string, CartItem[]>>((acc, item) => {
    const vid = item.product?.vendor?.id ?? 'unknown'
    if (!acc[vid]) acc[vid] = []
    acc[vid].push(item)
    return acc
  }, {})
}

/** Only sum available items; unavailable items are excluded by the backend total but
 *  this guards against stale cache showing wrong totals in the UI. */
export function calcCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    if (item.isAvailable === false) return sum
    return sum + Number(item.product?.price ?? 0) * item.quantity
  }, 0)
}
