import type { ProductListItem } from '@/shared/api/types'
import { ProductCard } from './ProductCard'
import { SkeletonGrid } from '@/shared/components/Skeletons'

interface ProductGridProps {
  products?: ProductListItem[]
  loading?: boolean
  skeletonCount?: number
}

export function ProductGrid({ products, loading, skeletonCount = 12 }: ProductGridProps) {
  if (loading) return <SkeletonGrid count={skeletonCount} />

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-ink/50">No products to show</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
