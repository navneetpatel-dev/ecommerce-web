import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Cart } from '@/shared/api/types'
import { cartApi } from './cart.api'

export const cartKeys = {
  all: ['cart'] as const,
}

type AddToCartVars = {
  variantId: string
  quantity?: number
  /** Opens the cart drawer after a successful add. Defaults to true. */
  openDrawer?: boolean
}

function syncCartCache(
  queryClient: ReturnType<typeof useQueryClient>,
  cart: Cart | undefined
) {
  if (cart) {
    queryClient.setQueryData(cartKeys.all, cart)
  }
  queryClient.invalidateQueries({ queryKey: cartKeys.all })
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

  return useMutation({
    mutationFn: ({ variantId, quantity = 1 }: AddToCartVars) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: (cart, variables) => {
      syncCartCache(queryClient, cart)
      if (variables.openDrawer !== false) {
        import('../store/cart.store').then((m) => m.useCartDrawerStore.getState().open())
      }
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (cart) => syncCartCache(queryClient, cart),
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (cart) => syncCartCache(queryClient, cart),
  })
}
