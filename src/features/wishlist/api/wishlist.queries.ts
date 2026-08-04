import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from './wishlist.api'
import { cartKeys } from '@/features/cart/api/cart.queries'

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.get(),
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.add(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export function useMoveToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.moveToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}
