import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import type { ProductListItem } from '@/shared/api/types'

interface TrendingSectionProps {
  products?: ProductListItem[]
  isLoading?: boolean
}

export function TrendingSection({ products, isLoading }: TrendingSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <TextEyebrow className="mb-2">Featured this week</TextEyebrow>
          <h2 className="font-display text-[1.75rem] font-semibold text-ink">Trending now</h2>
        </div>
        <Link
          href="/products?sort=trending"
          className="text-[0.9375rem] text-brand hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <ProductGrid products={products} loading={isLoading} skeletonCount={8} />
    </section>
  )
}
