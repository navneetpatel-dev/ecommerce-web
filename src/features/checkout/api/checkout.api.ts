import { apiClient } from '@/shared/api/client'
import type { Address, ShippingRate, CheckoutQuote } from '@/shared/api/types'
import { usersApi } from '@/features/users/api/users.api'

export const checkoutApi = {
  getAddresses: () => usersApi.getAddresses(),
  createAddress: (body: Omit<Address, 'id' | 'userId'>) => usersApi.createAddress(body),
  getShippingRates: (pincode: string, weight: number, method?: string) => {
    const params = new URLSearchParams({ pincode, weight: String(weight) })
    if (method) params.set('method', method)
    return apiClient.get<ShippingRate[]>(`/api/shipping/rates?${params.toString()}`)
  },
  getCheckoutQuote: (body: { addressId: string; shippingMethodByVendor: Record<string, string>; couponCode?: string | null }) =>
    apiClient.post<CheckoutQuote>('/api/checkout/quote', body),
  placeOrder: (body: { addressId: string; paymentMethod: string; couponCode?: string | null; shippingMethodByVendor: Record<string, string> }) =>
    apiClient.post<{ orderId: string; razorpayOrderId?: string }>('/api/checkout', body),
  verifyPayment: (body: Record<string, unknown>) =>
    apiClient.post<{ verified: boolean }>('/api/payments/verify', body),
}
