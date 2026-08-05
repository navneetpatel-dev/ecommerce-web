'use client'

import { useMemo } from 'react'
import { useCart } from '@/features/cart/api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '@/features/cart/utils/cart.utils'
import { useWalletBalance } from '@/features/wallet/api/wallet.queries'
import { useCheckoutStore } from '../store/checkout.store'
import { useAddresses, useCreateAddress } from '../api/checkout.queries'
import { usePlaceOrderWithRazorpay } from './usePlaceOrder'
import type { Address } from '@/shared/api/types'

export function useCheckoutPage() {
  const {
    step,
    addressId,
    shippingMethodByVendor,
    paymentMethod,
    setStep,
    setAddress,
    setShippingMethod,
    setPaymentMethod,
  } = useCheckoutStore()
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: addresses, isLoading: addressesLoading } = useAddresses()
  const createAddress = useCreateAddress()
  const { data: walletBalance } = useWalletBalance()
  const { handlePlaceOrder, quote, isPending } = usePlaceOrderWithRazorpay()

  const isLoading = cartLoading || addressesLoading

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

  const walletDisabled = isPending || (walletBalance ?? 0) < (quote?.grandTotal ?? total)
  const walletShortfall = Math.max(0, (quote?.grandTotal ?? total) - (walletBalance ?? 0))

  return {
    step,
    addressId,
    shippingMethodByVendor,
    paymentMethod,
    addresses,
    walletBalance,
    walletShortfall,
    quote,
    isPending,
    isLoading,
    groupedByVendor,
    total,
    hasItems: Boolean(cart?.items?.length),
    shippingReady,
    walletDisabled,
    isCreatingAddress: createAddress.isPending,
    onStepClick: (nextStep: number) => {
      if (nextStep < step) setStep(nextStep as 1 | 2 | 3 | 4)
    },
    onSelectAddress: setAddress,
    onSelectShipping: setShippingMethod,
    onContinueToShipping: () => setStep(2),
    onContinueToPayment: () => setStep(3),
    onBackToShipping: () => setStep(2),
    onBackToPayment: () => setStep(3),
    onSelectPayment: (method: string) => {
      setPaymentMethod(method)
      setStep(4)
    },
    onPlaceOrder: () => {
      if (!paymentMethod) return
      void handlePlaceOrder(paymentMethod)
    },
    onCreateAddress: (body: Omit<Address, 'id' | 'userId'>) => {
      createAddress.mutate(body, {
        onSuccess: (created) => {
          setAddress(created.id)
        },
      })
    },
  }
}
