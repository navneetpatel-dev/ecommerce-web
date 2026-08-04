import { useState, useMemo } from 'react'
import type { ProductVariant } from '@/shared/api/types'
import { findMatchingVariant, groupVariantAttributes, isVariantCombinationAvailable } from '../utils/products.utils'

export function useVariantSelection(variants: ProductVariant[], basePrice: number, baseStock: number) {
  const [selected, setSelected] = useState<Record<string, string>>({})

  const matchedVariant = useMemo(
    () => findMatchingVariant(variants, selected),
    [variants, selected]
  )

  const attributeGroups = useMemo(
    () => groupVariantAttributes(variants),
    [variants]
  )

  const selectValue = (key: string, value: string) => {
    setSelected((s) => ({ ...s, [key]: value }))
  }

  const isAvailable = (key: string, value: string) =>
    isVariantCombinationAvailable(variants, selected, key, value)

  const isActive = (key: string, value: string) => selected[key] === value

  const currentPrice = matchedVariant?.price ?? basePrice
  const currentStock = matchedVariant?.stock ?? baseStock
  const variantId = matchedVariant?.id ?? null

  return {
    attributeGroups,
    currentPrice,
    currentStock,
    variantId,
    isAvailable,
    isActive,
    selectValue,
    hasPriceChange: matchedVariant?.price !== undefined && matchedVariant.price !== basePrice,
  }
}
