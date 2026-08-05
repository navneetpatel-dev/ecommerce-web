'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useProductList } from '@/features/products/api/products.queries'
import { ProductGrid } from '@/features/products/components/ProductGrid'

export function TrendingSection() {
  const { data: trending, isLoading } = useProductList({ sort: 'trending', limit: 12 })

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-[1.75rem] font-semibold text-ink">Trending now</h2>
        <Link href="/products?sort=trending" className="text-[0.9375rem] text-brand hover:underline inline-flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <ProductGrid products={trending?.items} loading={isLoading} skeletonCount={8} />
    </section>
  )
}
