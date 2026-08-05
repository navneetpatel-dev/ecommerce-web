import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/api/wishlist.queries'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'

export function useWishlistToggle(productId: string | undefined) {
  const { data: wishlist } = useWishlist()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const { requireAuth } = useRequireAuth()

  const isWishlisted = wishlist?.items?.some((item) => item.productId === productId)

  const toggle = () => {
    if (!productId) return
    if (
      !requireAuth({
        title: 'Save to wishlist',
        message: 'Sign in to save products to your wishlist and find them later.',
      })
    ) {
      return
    }
    if (isWishlisted) {
      removeFromWishlist.mutate(productId)
    } else {
      addToWishlist.mutate(productId)
    }
  }

  return { isWishlisted, toggle, isPending: addToWishlist.isPending || removeFromWishlist.isPending }
}
