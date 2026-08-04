'use client'
import { useWishlist, useRemoveFromWishlist, useMoveToCart } from '../api/wishlist.queries'
import { WishlistGrid } from '../components/WishlistGrid'
import { EmptyWishlistState } from '../components/EmptyWishlistState'
import { SkeletonGrid } from '@/shared/components/Skeletons'

export function WishlistPage() {
  const { data, isLoading } = useWishlist()
  const removeItem = useRemoveFromWishlist()
  const moveToCart = useMoveToCart()

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><SkeletonGrid count={4} /></div>
  if (!data?.items?.length) return <EmptyWishlistState />

  return (
    <WishlistGrid
      items={data.items}
      onMoveToCart={(id) => moveToCart.mutate(id)}
      onRemove={(id) => removeItem.mutate(id)}
    />
  )
}
