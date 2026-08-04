import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/api/wishlist.queries'

export function useWishlistToggle(productId: string | undefined) {
  const { data: wishlist } = useWishlist()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()

  const isWishlisted = wishlist?.items?.some((item) => item.productId === productId)

  const toggle = () => {
    if (!productId) return
    if (isWishlisted) {
      removeFromWishlist.mutate(productId)
    } else {
      addToWishlist.mutate(productId)
    }
  }

  return { isWishlisted, toggle, isPending: addToWishlist.isPending || removeFromWishlist.isPending }
}
