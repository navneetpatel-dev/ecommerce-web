import { Package } from 'lucide-react'
import type { ProductListItem } from '@/shared/api/types'
import { ProductCard } from './ProductCard'
import { SkeletonGrid } from '@/shared/components/Skeletons'
import { EmptyState } from '@/shared/components/EmptyState'

interface ProductGridProps {
  products?: ProductListItem[]
  loading?: boolean
  skeletonCount?: number
  emptyHeading?: string
  emptyMessage?: string
  emptyActionLabel?: string
  emptyActionTo?: string
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 12,
  emptyHeading = 'No products found',
  emptyMessage = 'No products match these filters.',
  emptyActionLabel = 'Clear all filters',
  emptyActionTo,
}: ProductGridProps) {
  if (loading) return <SkeletonGrid count={skeletonCount} />

  if (!products?.length) {
    return (
      <EmptyState
        heading={emptyHeading}
        message={emptyMessage}
        icon={Package}
        actionLabel={emptyActionLabel}
        actionTo={emptyActionTo}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
