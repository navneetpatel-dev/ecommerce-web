'use client'

import { useVariantSelector } from '../hooks/useVariantSelector'
import { VariantSelector } from '../components/VariantSelector'
import type { ProductVariant } from '@/shared/api/types'

interface VariantSelectorContainerProps {
  variants: ProductVariant[]
  basePrice: number
  baseStock: number
  className?: string
}

export function VariantSelectorContainer({
  variants,
  basePrice,
  baseStock,
  className,
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
      onAddToCart={selector.addSelectedToCart}
      isAddingToCart={selector.isAddingToCart}
      className={className}
    />
  )
}
