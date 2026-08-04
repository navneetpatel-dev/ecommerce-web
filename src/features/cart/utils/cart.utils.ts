import type { CartItem } from '@/shared/api/types'

export function groupItemsByVendor(items: CartItem[]): Record<string, CartItem[]> {
  return items.reduce<Record<string, CartItem[]>>((acc, item) => {
    const vid = item.product.vendor.id
    if (!acc[vid]) acc[vid] = []
    acc[vid].push(item)
    return acc
  }, {})
}

export function calcCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}
