'use client'

import { useAddToCart } from '@/features/cart/api/cart.queries'
import { useVariantSelection } from './useVariantSelection'
import type { ProductVariant } from '@/shared/api/types'

export function useVariantSelector(variants: ProductVariant[], basePrice: number, baseStock: number) {
  const addToCart = useAddToCart()
  const selection = useVariantSelection(variants, basePrice, baseStock)

  return {
    ...selection,
    isAddingToCart: addToCart.isPending,
    addSelectedToCart: () => {
      if (selection.variantId) addToCart.mutate(selection.variantId)
    },
  }
}
