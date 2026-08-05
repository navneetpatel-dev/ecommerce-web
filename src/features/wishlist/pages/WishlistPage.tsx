'use client'
import { useWishlist, useRemoveFromWishlist, useMoveToCart } from '../api/wishlist.queries'
import { EmptyWishlistState } from '../components/EmptyWishlistState'
import { SkeletonGrid } from '@/shared/components/Skeletons'
import { ProductCard } from '@/features/products/components/ProductCard'

export function WishlistPage() {
  const { data, isLoading } = useWishlist()
  const removeItem = useRemoveFromWishlist()
  const moveToCart = useMoveToCart()

  if (isLoading) return <div className="max-w-[1600px] mx-auto px-4 py-8"><SkeletonGrid count={4} /></div>
  if (!data?.items?.length) return <EmptyWishlistState />

  const products = data.items.map((item: any) => ({
    ...item.product,
    isWishlisted: true,
  }))

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product: any) => (
          <ProductCard
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
