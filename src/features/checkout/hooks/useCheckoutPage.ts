'use client'

import { useMemo } from 'react'
import { useCart } from '@/features/cart/api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '@/features/cart/utils/cart.utils'
import { useWalletBalance } from '@/features/wallet/api/wallet.queries'
import { useCheckoutStore } from '../store/checkout.store'
import { useAddresses } from '../api/checkout.queries'
import { usePlaceOrderWithRazorpay } from './usePlaceOrder'

export function useCheckoutPage() {
  const { step, addressId, shippingMethodByVendor, setStep, setAddress, setShippingMethod } = useCheckoutStore()
  const { data: cart } = useCart()
  const { data: addresses } = useAddresses()
  const { data: walletBalance } = useWalletBalance()
  const { handlePlaceOrder, quote, isPending } = usePlaceOrderWithRazorpay()

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {}
    return groupItemsByVendor(cart.items)
  }, [cart])

  const total = useMemo(() => {
    if (!cart?.items) return 0
    return calcCartTotal(cart.items)
  }, [cart])

  const shippingReady = useMemo(
    () => Object.keys(groupedByVendor).every((vendorId) => Boolean(shippingMethodByVendor[vendorId])),
    [groupedByVendor, shippingMethodByVendor]
  )

  const walletDisabled = isPending || (walletBalance ?? 0) < (quote?.grandTotal ?? 0)

  return {
    step,
    addressId,
    shippingMethodByVendor,
    addresses,
    walletBalance,
    quote,
    isPending,
    groupedByVendor,
    total,
    hasItems: Boolean(cart?.items?.length),
    shippingReady,
    walletDisabled,
    onStepClick: (nextStep: number) => setStep(nextStep as 1 | 2 | 3 | 4),
    onSelectAddress: setAddress,
    onSelectShipping: setShippingMethod,
    onContinueToShipping: () => setStep(2),
    onContinueToPayment: () => setStep(3),
    onBackToShipping: () => setStep(2),
    onBackToPayment: () => setStep(3),
    onPay: handlePlaceOrder,
    onPlaceOrder: () => handlePlaceOrder('razorpay'),
  }
}
