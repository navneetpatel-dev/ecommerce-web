'use client'

import { useProductList } from '@/features/products/api/products.queries'

export function useTrendingProducts() {
  const { data, isLoading } = useProductList({ sort: 'trending', limit: 12 })

  return {
    products: data?.items,
    isLoading,
  }
}
