'use client'

import { useAddToCart } from '@/features/cart/api/cart.queries'
import { usePrefetchProduct } from '../api/products.queries'
import { useWishlistToggle } from './useWishlistToggle'
import type { ProductListItem } from '@/shared/api/types'

export function useProductCard(product: ProductListItem) {
  const { mutate: addToCart, isPending } = useAddToCart()
  const prefetch = usePrefetchProduct()
  const { isWishlisted, toggle } = useWishlistToggle(product.isWishlisted ? product.id : undefined)

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.basePrice)
  const discountPercent =
    hasDiscount && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
      : 0

  return {
    isWishlisted,
    isAddingToCart: isPending,
    hasDiscount,
    discountPercent,
    prefetch: () => prefetch(product.id),
    toggleWishlist: toggle,
    addToCart: () => addToCart(product.id),
  }
}
