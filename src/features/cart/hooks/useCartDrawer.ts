'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { useCartDrawerStore } from '../store/cart.store'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import { couponsApi } from '@/features/coupons/api/coupons.api'
import { useCheckoutStore } from '@/features/checkout/store/checkout.store'
import type { CartItem } from '@/shared/api/types'

export function useCartDrawer() {
  const router = useRouter()
  const isOpen = useCartDrawerStore((s) => s.isOpen)
  const close = useCartDrawerStore((s) => s.close)
  const setCouponCode = useCheckoutStore((s) => s.setCouponCode)
  const appliedCouponCode = useCheckoutStore((s) => s.appliedCouponCode)
  const { data: cart } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  const [couponInput, setCouponInput] = useState('')
  const [couponMessage, setCouponMessage] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponPending, setCouponPending] = useState(false)

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {} as Record<string, CartItem[]>
    return groupItemsByVendor(cart.items)
  }, [cart])

  const total = useMemo(() => {
    if (!cart?.items) return 0
    return calcCartTotal(cart.items)
  }, [cart])

  const decreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })
      return
    }
    removeItem.mutate(item.id)
  }

  const increaseQuantity = (item: CartItem) => {
    updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })
  }

  const applyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return
    setCouponPending(true)
    setCouponError(null)
    setCouponMessage(null)
    try {
      const result = await couponsApi.apply(code)
      setCouponCode(code)
      setCouponMessage(`Coupon applied — ₹${result.discount} off`)
    } catch {
      setCouponError('Invalid or expired coupon code')
      setCouponCode(null)
    } finally {
      setCouponPending(false)
    }
  }

  const continueShopping = () => {
    close()
    router.push('/products')
  }

  return {
    isOpen,
    close,
    items: cart?.items ?? [],
    hasItems: Boolean(cart?.items?.length),
    groupedByVendor,
    total,
    decreaseQuantity,
    increaseQuantity,
    removeItem: (itemId: string) => removeItem.mutate(itemId),
    couponInput,
    setCouponInput,
    couponMessage,
    couponError,
    couponPending,
    appliedCouponCode,
    applyCoupon,
    continueShopping,
  }
}
