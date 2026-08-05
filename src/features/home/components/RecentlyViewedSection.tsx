'use client'

import { useEffect, useState } from 'react'
import type { ProductListItem } from '@/shared/api/types'
import { ProductGrid } from '@/features/products/components/ProductGrid'

const RECENTLY_VIEWED_KEY = 'recently-viewed-products'

export function RecentlyViewedSection() {
  const [products, setProducts] = useState<ProductListItem[]>([])

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]') as ProductListItem[]
      if (Array.isArray(parsed) && parsed.length) {
        setProducts(parsed.slice(0, 8))
      }
    } catch {
      setProducts([])
    }
  }, [])

  if (!products.length) return null

  return (
    <section>
      <h2 className="text-[1.375rem] font-semibold text-ink mb-6">Recently viewed</h2>
      <ProductGrid products={products} skeletonCount={8} />
    </section>
  )
}
