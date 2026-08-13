import { useState, useMemo, useEffect } from 'react'
import type { ProductVariant } from '@/shared/api/types'
import {
  findMatchingVariant,
  getMatrixAttributeKeys,
  getMatrixVariants,
  groupVariantAttributes,
  isVariantCombinationAvailable,
  resolveDefaultVariantSelection,
} from '../utils/products.utils'

export function useVariantSelection(variants: ProductVariant[], basePrice: number, baseStock: number) {
  const [selected, setSelected] = useState<Record<string, string>>({})

  const variantKey = useMemo(() => variants.map((variant) => variant.id).join('|'), [variants])

  useEffect(() => {
    setSelected(resolveDefaultVariantSelection(variants))
  }, [variantKey, variants])

  const matchedVariant = useMemo(
    () => findMatchingVariant(variants, selected),
    [variants, selected],
  )

  const attributeGroups = useMemo(
    () => groupVariantAttributes(variants),
    [variants],
  )

  const selectValue = (key: string, value: string) => {
    setSelected((prev) => {
      const next = { ...prev, [key]: value }
      if (findMatchingVariant(variants, next)) return next

      const matrixKeys = getMatrixAttributeKeys(variants)
      const matrixVariants = getMatrixVariants(variants, matrixKeys)
      const inStockMatch = matrixVariants.find(
        (variant) =>
          Number(variant.stock) > 0 && variant.attributes[key] === value,
      )

      if (inStockMatch) return { ...inStockMatch.attributes }

      return next
    })
  }

  const isAvailable = (key: string, value: string) =>
    isVariantCombinationAvailable(variants, selected, key, value)

  const isActive = (key: string, value: string) => selected[key] === value

  const currentPrice = matchedVariant?.price ?? basePrice
  const currentStock =
    matchedVariant?.stock ??
    (variants.length === 1 ? baseStock : 0)
  const variantId = matchedVariant?.id ?? null

  return {
    attributeGroups,
    currentPrice,
    currentStock,
    variantId,
    matchedVariant,
    isAvailable,
    isActive,
    selectValue,
    hasPriceChange: matchedVariant?.price !== undefined && matchedVariant.price !== basePrice,
  }
}
