'use client'

import { useMemo } from 'react'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import { clampCartQuantity } from '@/shared/constants/cart'
import type { CartItem } from '@/shared/api/types'

export function useCartPage() {
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  const items = cart?.items ?? []
  const hasItems = items.length > 0
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const hasUnavailableItems = items.some((item) => item.isAvailable === false)

  const groupedByVendor = useMemo(
    () => (hasItems ? groupItemsByVendor(items) : {}),
    [hasItems, items]
  )

  const total = useMemo(
    () => (hasItems ? calcCartTotal(items) : 0),
    [hasItems, items]
  )

  return {
    isLoading,
    hasItems,
    itemCount,
    hasUnavailableItems,
    groupedByVendor,
    total,
    updateQuantity: (itemId: string, quantity: number) =>
      updateItem.mutate({ itemId, quantity: clampCartQuantity(quantity) }),
    removeItem: (itemId: string) => removeItem.mutate(itemId),
  }
}

export type CartPageGroupedItems = Record<string, CartItem[]>
