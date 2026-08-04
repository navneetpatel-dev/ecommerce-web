import { useQuery, useMutation } from '@tanstack/react-query'
import { checkoutApi } from './checkout.api'

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => checkoutApi.getAddresses(),
  })
}

export function useShippingRates(pincode: string, weightGrams: number) {
  return useQuery({
    queryKey: ['shipping', 'rates', pincode, weightGrams],
    queryFn: () => checkoutApi.getShippingRates(pincode, weightGrams),
    enabled: !!pincode && weightGrams > 0,
  })
}

export function useCheckoutQuote(input: { addressId: string | null; shippingMethodByVendor: Record<string, string>; couponCode: string | null }) {
  return useQuery({
    queryKey: ['checkout', 'quote', input],
    queryFn: () => checkoutApi.getCheckoutQuote(input as Parameters<typeof checkoutApi.getCheckoutQuote>[0]),
    enabled: !!input.addressId && Object.keys(input.shippingMethodByVendor).length > 0,
  })
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (body: Parameters<typeof checkoutApi.placeOrder>[0]) => checkoutApi.placeOrder(body),
  })
}
