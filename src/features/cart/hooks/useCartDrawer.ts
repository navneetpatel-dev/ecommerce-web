'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { useCartDrawerStore } from '../store/cart.store'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import { useCartCoupons } from './useCartCoupons'
import { navigate } from '@/shared/utils/navigate'
import { clampCartQuantity } from '@/shared/constants/cart'
import { PATHS } from '@/shared/constants/paths'
import type { CartItem } from '@/shared/api/types'

export function useCartDrawer() {
  const router = useRouter()
  const isOpen = useCartDrawerStore((s) => s.isOpen)
  const close = useCartDrawerStore((s) => s.close)
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const coupons = useCartCoupons({ cart, enabled: isOpen })

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {} as Record<string, CartItem[]>
    return groupItemsByVendor(cart.items)
  }, [cart])

  const total = useMemo(() => {
    if (typeof cart?.total === 'number') {
      return Math.max(0, cart.total - (cart.appliedCoupon?.discount ?? 0))
    }
    if (!cart?.items) return 0
    return Math.max(0, calcCartTotal(cart.items) - (coupons.appliedDiscount || 0))
  }, [cart, coupons.appliedDiscount])

  const hasUnavailableItems = cart?.items?.some((item) => item.isAvailable === false) ?? false

  const updateQuantity = (itemId: string, quantity: number) => {
    updateItem.mutate({ itemId, quantity: clampCartQuantity(quantity) })
  }

  const continueShopping = () => {
    close()
    navigate(router, PATHS.products)
  }

  return {
    isOpen,
    close,
    isLoading,
    items: cart?.items ?? [],
    hasItems: Boolean(cart?.items?.length),
    hasUnavailableItems,
    groupedByVendor,
    total,
    updateQuantity,
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
    continueShopping,
  }
}
