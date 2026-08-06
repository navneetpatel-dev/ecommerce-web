import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/api/wishlist.queries'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'

export function useWishlistToggle(productId: string | undefined) {
  const { data: wishlist, isSuccess } = useWishlist()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const { requireAuth } = useRequireAuth()

  // undefined while wishlist hasn't loaded yet — callers can fall back to product.isWishlisted
  const isWishlisted = !productId
    ? false
    : isSuccess
      ? Boolean(wishlist?.items?.some((item) => item.productId === productId))
      : undefined

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

    const currentlyWishlisted =
      typeof isWishlisted === 'boolean'
        ? isWishlisted
        : Boolean(wishlist?.items?.some((item) => item.productId === productId))

    if (currentlyWishlisted) {
      removeFromWishlist.mutate(productId)
    } else {
      addToWishlist.mutate(productId)
    }
  }

  return {
    isWishlisted,
    toggle,
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  }
}
