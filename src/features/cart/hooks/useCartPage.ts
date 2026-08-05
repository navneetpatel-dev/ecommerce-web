'use client'

import { useMemo } from 'react'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import type { CartItem } from '@/shared/api/types'

export function useCartPage() {
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  const items = cart?.items ?? []
  const hasItems = items.length > 0
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)

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
    groupedByVendor,
    total,
    updateQuantity: (itemId: string, quantity: number) =>
      updateItem.mutate({ itemId, quantity }),
    removeItem: (itemId: string) => removeItem.mutate(itemId),
  }
}

export type CartPageGroupedItems = Record<string, CartItem[]>
