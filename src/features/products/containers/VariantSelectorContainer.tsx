'use client'

import { useVariantSelector } from '../hooks/useVariantSelector'
import { VariantSelector } from '../components/VariantSelector'
import type { ProductVariant } from '@/shared/api/types'

interface VariantSelectorContainerProps {
  variants: ProductVariant[]
  basePrice: number
  baseStock: number
  className?: string
  /** Prefer false on PDP when page-level Add to Cart handles purchase. */
  showAddToCart?: boolean
}

export function VariantSelectorContainer({
  variants,
  basePrice,
  baseStock,
  className,
  showAddToCart = false,
}: VariantSelectorContainerProps) {
  const selector = useVariantSelector(variants, basePrice, baseStock)

  return (
    <VariantSelector
      attributeGroups={selector.attributeGroups}
      currentPrice={selector.currentPrice}
      currentStock={selector.currentStock}
      basePrice={basePrice}
      hasPriceChange={selector.hasPriceChange}
      isAvailable={selector.isAvailable}
      isActive={selector.isActive}
      onSelectValue={selector.selectValue}
      showAddToCart={showAddToCart}
      onAddToCart={selector.addSelectedToCart}
      isAddingToCart={selector.isAddingToCart}
      canAddToCart={selector.canAddToCart}
      className={className}
    />
  )
}
