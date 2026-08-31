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
