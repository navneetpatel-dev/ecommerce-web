'use client'

import { useMemo } from 'react'
import { useWishlist } from '../api/wishlist.queries'
import type { ProductListItem } from '@/shared/api/types'

export function useWishlistPage() {
  const { data, isLoading } = useWishlist()

  const products = useMemo<ProductListItem[]>(() => {
    if (!data?.items?.length) return []
    return data.items.flatMap((item) => {
      const product = item.product
      if (!product?.id) return []
      const variants = product.variants ?? []
      const stockFromVariants = variants.reduce(
        (sum, variant) => sum + Number(variant.stock ?? 0),
        0
      )
      const next: ProductListItem = {
        ...product,
        stock: Number(product.stock ?? stockFromVariants),
        variants,
        isWishlisted: true,
      }
      return [next]
    })
  }, [data])

  return {
    isLoading,
    products,
    isEmpty: !isLoading && products.length === 0,
  }
}
