import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useCheckoutStore } from '../store/checkout.store'
import { usePlaceOrder, useCheckoutQuote } from '../api/checkout.queries'
import { checkoutApi } from '../api/checkout.api'
import { loadRazorpayScript } from '../utils/loadRazorpayScript'
import { navigate } from '@/shared/utils/navigate'

export function usePlaceOrderWithRazorpay() {
  const { addressId, shippingMethodByVendor, appliedCouponCode } = useCheckoutStore()
  const placeOrder = usePlaceOrder()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const quoteInput = { addressId, shippingMethodByVendor, couponCode: appliedCouponCode }
  const { data: quote } = useCheckoutQuote(quoteInput)

  const clearCartCache = () => {
    void queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  const restoreCancelledCheckout = async (orderId: string, fallback: string) => {
    try {
      await checkoutApi.cancelCheckout({ orderId })
      clearCartCache()
      setPaymentError(fallback)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : fallback
      setPaymentError(message)
      clearCartCache()
    }
  }

  const handlePlaceOrder = async (method: string) => {
    if (!addressId) return
    setPaymentError(null)

    try {
      const result = await placeOrder.mutateAsync({
        addressId,
        paymentMethod: method,
        couponCode: appliedCouponCode || undefined,
        shippingMethodByVendor,
      })

      if (method === 'razorpay' && result.razorpayOrderId) {
        await loadRazorpayScript()
        if (!window.Razorpay) {
          setPaymentError('Unable to load payment checkout. Please try again.')
          return
        }

        const keyId = result.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
        if (!keyId || !result.amount || !result.currency) {
          setPaymentError('Payment could not be started. Missing order details from server.')
          return
        }

        const rzp = new window.Razorpay({
          key: keyId,
          order_id: result.razorpayOrderId,
          amount: result.amount,
          currency: result.currency,
          name: 'Marketplace',
          handler: async (response) => {
            try {
              await checkoutApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              clearCartCache()
              navigate(router, `/orders/${result.orderId}/confirmation`)
            } catch {
              // Signature UX check failed — order still exists; webhook may still confirm
              setPaymentError('Payment received but confirmation failed. Check your orders shortly.')
              clearCartCache()
            }
          },
          modal: {
            ondismiss: () => {
              void restoreCancelledCheckout(
                result.orderId,
                'Payment cancelled. Your cart has been restored.',
              )
            },
          },
        })

        rzp.on('payment.failed', (resp) => {
          void restoreCancelledCheckout(
            result.orderId,
            resp.error?.description || 'Payment failed. Your cart has been restored.',
          )
        })

        rzp.open()
        return
      }

      clearCartCache()
      navigate(router, `/orders/${result.orderId}/confirmation`)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not place order. Please try again.'
      setPaymentError(message)
    }
  }

  return {
    handlePlaceOrder,
    quote,
    isPending: placeOrder.isPending,
    paymentError,
    clearPaymentError: () => setPaymentError(null),
  }
}
