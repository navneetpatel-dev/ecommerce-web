'use client'

import { useEffect, useState } from 'react'
import type { ProductListItem } from '@/shared/api/types'
import { getRecentlyViewedProducts } from '@/features/products/utils/recently-viewed'

export function useRecentlyViewed(limit = 8) {
  const [products, setProducts] = useState<ProductListItem[]>([])

  useEffect(() => {
    setProducts(getRecentlyViewedProducts().slice(0, limit))
  }, [limit])

  return { products }
}
