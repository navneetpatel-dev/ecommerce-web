'use client'

import { useMemo } from 'react'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { useCartDrawerStore } from '../store/cart.store'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import type { CartItem } from '@/shared/api/types'

export function useCartDrawer() {
  const isOpen = useCartDrawerStore((s) => s.isOpen)
  const close = useCartDrawerStore((s) => s.close)
  const { data: cart } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

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
  }
}
