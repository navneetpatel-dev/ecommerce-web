import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checkoutApi } from './checkout.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { Address } from '@/shared/api/types'

function sortAddresses(list: Address[]) {
  return [...list].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
    return 0
  })
}

export function useAddresses() {
  const currentUser = useAuthStore((s) => s.currentUser)

  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => checkoutApi.getAddresses(),
    enabled: Boolean(currentUser),
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof checkoutApi.createAddress>[0]) =>
      checkoutApi.createAddress(body),
    onSuccess: (created) => {
      queryClient.setQueryData<typeof created[]>(['addresses'], (prev) => {
        const list = prev ?? []
        const without = list.filter((a) => a.id !== created.id)
        if (created.isDefault) {
          return sortAddresses([created, ...without.map((a) => ({ ...a, isDefault: false }))])
        }
        return sortAddresses([created, ...without])
      })
      void queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export function useShippingRates(pincode: string, weightGrams: number) {
  return useQuery({
    queryKey: ['shipping', 'rates', pincode, weightGrams],
    queryFn: () => checkoutApi.getShippingRates(pincode, weightGrams),
    enabled: !!pincode && weightGrams > 0,
  })
}

export function useCheckoutQuote(input: {
  addressId: string | null
  shippingMethodByVendor: Record<string, string>
  couponCode: string | null
  walletAmountToUse?: number
}) {
  return useQuery({
    queryKey: ['checkout', 'quote', input],
    queryFn: () =>
      checkoutApi.getCheckoutQuote(input as Parameters<typeof checkoutApi.getCheckoutQuote>[0]),
    enabled: !!input.addressId && Object.keys(input.shippingMethodByVendor).length > 0,
  })
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (body: Parameters<typeof checkoutApi.placeOrder>[0]) => checkoutApi.placeOrder(body),
  })
}
