'use client'

import { useMemo } from 'react'
import { useWishlist } from '../api/wishlist.queries'
import type { ProductListItem } from '@/shared/api/types'

export function useWishlistPage() {
  const { data, isLoading } = useWishlist()

  const products = useMemo<ProductListItem[]>(() => {
    if (!data?.items?.length) return []
    return data.items.map((item: any) => ({
      ...item.product,
      isWishlisted: true,
    }))
  }, [data])

  return {
    isLoading,
    products,
    isEmpty: !isLoading && products.length === 0,
  }
}
