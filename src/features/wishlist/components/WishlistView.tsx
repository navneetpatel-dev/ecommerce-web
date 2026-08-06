import { EmptyWishlistState } from './EmptyWishlistState'
import { SkeletonGrid } from '@/shared/components/Skeletons'
import { ProductCardContainer } from '@/features/products/containers/ProductCardContainer'
import type { ProductListItem } from '@/shared/api/types'

interface WishlistViewProps {
  isLoading: boolean
  isEmpty: boolean
  products: ProductListItem[]
}

export function WishlistView({ isLoading, isEmpty, products }: WishlistViewProps) {
  if (isLoading) {
    return (
      <div className="storefront-container py-8">
        <SkeletonGrid count={4} />
      </div>
    )
  }

  if (isEmpty) return <EmptyWishlistState />

  return (
    <div className="storefront-container py-8">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCardContainer
            key={product.id}
            product={product}
            quickAddLabel="Move to cart"
            showWishlist
          />
        ))}
      </div>
    </div>
  )
}
