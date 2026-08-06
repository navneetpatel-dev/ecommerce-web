'use client'

import { useEffect, useMemo } from 'react'
import { useCart } from '@/features/cart/api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '@/features/cart/utils/cart.utils'
import { useWalletBalance } from '@/features/wallet/api/wallet.queries'
import { useCheckoutStore } from '../store/checkout.store'
import { useAddresses, useCreateAddress } from '../api/checkout.queries'
import { usePlaceOrderWithRazorpay } from './usePlaceOrder'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'
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
  const { handlePlaceOrder, quote, isPending, paymentError } = usePlaceOrderWithRazorpay()
  const { requireAuth } = useRequireAuth()

  const isLoading = cartLoading || addressesLoading

  // Prefer default address, otherwise first saved address
  useEffect(() => {
    if (!addresses?.length) return
    const stillValid = addressId && addresses.some((a) => a.id === addressId)
    if (stillValid) return
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0]
    if (preferred) setAddress(preferred.id)
  }, [addresses, addressId, setAddress])

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
    paymentError,
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
      if (
        !requireAuth({
          title: 'Complete your order',
          message: 'Sign in to place your order and track it in your account.',
          redirectTo: '/checkout',
        })
      ) {
        return
      }
      void handlePlaceOrder(paymentMethod)
    },
    onCreateAddress: (body: Omit<Address, 'id' | 'userId'>) => {
      if (
        !requireAuth({
          title: 'Add a shipping address',
          message: 'Sign in to save addresses and continue checkout.',
          redirectTo: '/checkout',
        })
      ) {
        return Promise.reject(new Error('Sign in required'))
      }
      return new Promise<void>((resolve, reject) => {
        createAddress.mutate(body, {
          onSuccess: (created) => {
            setAddress(created.id)
            resolve()
          },
          onError: (err) => reject(err),
        })
      })
    },
  }
}
