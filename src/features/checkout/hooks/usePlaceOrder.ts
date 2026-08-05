import { useRouter } from 'next/navigation'
import { useCheckoutStore } from '../store/checkout.store'
import { usePlaceOrder, useCheckoutQuote } from '../api/checkout.queries'
import { checkoutApi } from '../api/checkout.api'
import { navigate } from '@/shared/utils/navigate'

export function usePlaceOrderWithRazorpay() {
  const { addressId, shippingMethodByVendor, appliedCouponCode } = useCheckoutStore()
  const placeOrder = usePlaceOrder()
  const router = useRouter()

  const quoteInput = { addressId, shippingMethodByVendor, couponCode: appliedCouponCode }
  const { data: quote } = useCheckoutQuote(quoteInput)

  const handlePlaceOrder = async (method: string) => {
    if (!addressId) return
    const result = await placeOrder.mutateAsync({
      addressId,
      paymentMethod: method,
      couponCode: appliedCouponCode || undefined,
      shippingMethodByVendor,
    })
    if (method === 'razorpay' && result.razorpayOrderId) {
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        order_id: result.razorpayOrderId,
        amount: quote?.grandTotal ? quote.grandTotal * 100 : 0,
        currency: 'INR',
        name: 'Marketplace',
        handler: async (response: any) => {
          await checkoutApi.verifyPayment({
            razorpayOrderId: result.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
          navigate(router, `/orders/${result.orderId}/confirmation`)
        },
      })
      rzp.open()
    } else {
      navigate(router, `/orders/${result.orderId}/confirmation`)
    }
  }

  return { handlePlaceOrder, quote, isPending: placeOrder.isPending }
}
