import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from './cart.api'

export const cartKeys = {
  all: ['cart'] as const,
}

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => cartApi.get(),
    staleTime: 1000 * 30,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const openCart = () => {
    import('../store/cart.store').then((m) => m.useCartDrawerStore.getState().open())
  }

  return useMutation({
    mutationFn: ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      openCart()
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  })
}
