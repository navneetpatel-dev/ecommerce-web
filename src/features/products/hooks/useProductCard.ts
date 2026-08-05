'use client'

import { useAddToCart } from '@/features/cart/api/cart.queries'
import { useMoveToCart } from '@/features/wishlist/api/wishlist.queries'
import { usePrefetchProduct } from '../api/products.queries'
import { useWishlistToggle } from './useWishlistToggle'
import type { ProductListItem } from '@/shared/api/types'

interface UseProductCardOptions {
  /** Use wishlist move-to-cart API instead of cart add-by-variant. */
  moveToCart?: boolean
}

export function useProductCard(product: ProductListItem, options: UseProductCardOptions = {}) {
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { mutate: moveToCart, isPending: isMoving } = useMoveToCart()
  const prefetch = usePrefetchProduct()
  const { isWishlisted, toggle } = useWishlistToggle(product.id)

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.basePrice)
  const discountPercent =
    hasDiscount && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
      : 0

  const defaultVariantId = product.variants?.[0]?.id

  return {
    isWishlisted: Boolean(isWishlisted || product.isWishlisted),
    isAddingToCart: isAdding || isMoving,
    hasDiscount,
    discountPercent,
    prefetch: () => prefetch(product.slug || product.id),
    toggleWishlist: toggle,
    addToCart: () => {
      if (options.moveToCart) {
        moveToCart(product.id)
        return
      }
      if (!defaultVariantId) return
      addToCart({ variantId: defaultVariantId, quantity: 1 })
    },
  }
}
