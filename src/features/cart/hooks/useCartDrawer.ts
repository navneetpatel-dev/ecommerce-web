'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { useCartDrawerStore } from '../store/cart.store'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
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

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {} as Record<string, CartItem[]>
    return groupItemsByVendor(cart.items)
  }, [cart])

  const total = useMemo(() => {
    if (typeof cart?.merchandiseSubtotal === 'number') return cart.merchandiseSubtotal
    if (!cart?.items) return 0
    return calcCartTotal(cart.items)
  }, [cart])

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
    continueShopping,
  }
}
