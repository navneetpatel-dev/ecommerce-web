import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from './wishlist.api'
import { cartKeys } from '@/features/cart/api/cart.queries'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function useWishlist() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.get(),
    enabled: Boolean(accessToken),
    retry: false,
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
      import('@/features/cart/store/cart.store').then((m) => m.useCartDrawerStore.getState().open())
    },
  })
}
