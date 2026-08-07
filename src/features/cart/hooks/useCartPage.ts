'use client'

import { useMemo } from 'react'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import { useCartCoupons } from './useCartCoupons'
import { clampCartQuantity } from '@/shared/constants/cart'
import type { CartItem } from '@/shared/api/types'

export function useCartPage() {
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const coupons = useCartCoupons({ cart, enabled: true })

  const items = cart?.items ?? []
  const hasItems = items.length > 0
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const hasUnavailableItems = items.some((item) => item.isAvailable === false)

  const groupedByVendor = useMemo(
    () => (hasItems ? groupItemsByVendor(items) : {}),
    [hasItems, items],
  )

  const subtotal = useMemo(() => {
    if (typeof cart?.total === 'number') return cart.total
    return hasItems ? calcCartTotal(items) : 0
  }, [cart?.total, hasItems, items])

  const total = Math.max(0, subtotal - (coupons.appliedDiscount || 0))

  return {
    isLoading,
    hasItems,
    itemCount,
    hasUnavailableItems,
    groupedByVendor,
    subtotal,
    total,
    updateQuantity: (itemId: string, quantity: number) =>
      updateItem.mutate({ itemId, quantity: clampCartQuantity(quantity) }),
    removeItem: (itemId: string) => removeItem.mutate(itemId),
    couponInput: coupons.couponInput,
    setCouponInput: coupons.setCouponInput,
    couponMessage: coupons.couponMessage,
    couponError: coupons.couponError,
    couponPending: coupons.couponPending,
    appliedCouponCode: coupons.appliedCouponCode,
    appliedDiscount: coupons.appliedDiscount,
    eligible: coupons.eligible,
    eligibleLoading: coupons.eligibleLoading,
    applyCoupon: coupons.applyCoupon,
    applyEligible: coupons.applyEligible,
    removeCoupon: coupons.removeCoupon,
  }
}

export type CartPageGroupedItems = Record<string, CartItem[]>
