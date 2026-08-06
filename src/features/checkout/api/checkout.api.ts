import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { Address, ShippingRate, CheckoutQuote } from '@/shared/api/types'
import { usersApi } from '@/features/users/api/users.api'

export type PlaceOrderResponse = {
  orderId: string
  razorpayOrderId?: string
  amount?: number
  currency?: string
  keyId?: string
}

export type CancelCheckoutPayload = {
  orderId: string
}

export type VerifyPaymentPayload = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export const checkoutApi = {
  getAddresses: () => usersApi.getAddresses(),
  createAddress: (body: Omit<Address, 'id' | 'userId'>) => usersApi.createAddress(body),
  getShippingRates: (pincode: string, weight: number, method?: string) => {
    const params = new URLSearchParams({ pincode, weight: String(weight) })
    if (method) params.set('method', method)
    return apiClient.get<ShippingRate[]>(`${API.shipping.rates}?${params.toString()}`)
  },
  getCheckoutQuote: (body: {
    addressId: string
    shippingMethodByVendor: Record<string, string>
    couponCode?: string | null
  }) => apiClient.post<CheckoutQuote>(API.checkout.quote, body),
  placeOrder: (body: {
    addressId: string
    paymentMethod: string
    couponCode?: string | null
    shippingMethodByVendor: Record<string, string>
  }) => apiClient.post<PlaceOrderResponse>(API.checkout.create, body),
  /** UX confirmation only — webhook is the source of truth for PAID. */
  verifyPayment: (payload: VerifyPaymentPayload) =>
    apiClient.post<{ verified: boolean }>(API.checkout.verify, payload),
  cancelCheckout: (payload: CancelCheckoutPayload) =>
    apiClient.post<{ restored: boolean; orderId: string }>(API.checkout.cancel, payload),
}
