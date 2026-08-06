'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  cartKeys,
  useAddToCart,
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/features/cart/api/cart.queries'
import { usePrefetchProduct } from '../api/products.queries'
import { useWishlistToggle } from './useWishlistToggle'
import type { Cart, ProductListItem } from '@/shared/api/types'

function patchCartQuantity(
  cart: Cart | undefined,
  args: {
    product: ProductListItem
    variantId: string
    itemId?: string
    quantity: number
  }
): Cart {
  const base: Cart = cart ?? { id: 'optimistic-cart', items: [] }
  const { product, variantId, itemId, quantity } = args

  if (quantity <= 0) {
    return {
      ...base,
      items: base.items.filter((item) =>
        itemId ? item.id !== itemId : item.variantId !== variantId
      ),
    }
  }

  const existing = base.items.find((item) =>
    itemId ? item.id === itemId : item.variantId === variantId
  )

  if (existing) {
    return {
      ...base,
      items: base.items.map((item) =>
        item.id === existing.id ? { ...item, quantity } : item
      ),
    }
  }

  return {
    ...base,
    items: [
      ...base.items,
      {
        id: `optimistic-${variantId}`,
        variantId,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          price: product.basePrice,
          vendor: product.vendor,
        },
        variant: { sku: '', attributes: {} },
      },
    ],
  }
}

export function useProductCard(product: ProductListItem) {
  const queryClient = useQueryClient()
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { mutate: updateCartItem, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: removeCartItem, isPending: isRemoving } = useRemoveCartItem()
  const { data: cart } = useCart()
  const prefetch = usePrefetchProduct()
  const { isWishlisted, toggle } = useWishlistToggle(product.id)

  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.basePrice)
  const discountPercent =
    hasDiscount && product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
      : 0

  const defaultVariantId = product.variants?.[0]?.id
  const cartItem =
    cart?.items.find(
      (item) => item.variantId === defaultVariantId || item.product.id === product.id
    ) ?? null

  const serverQty = cartItem?.quantity ?? 0
  const [optimisticQty, setOptimisticQty] = useState<number | null>(null)

  useEffect(() => {
    if (optimisticQty === null) return
    if (serverQty === optimisticQty) {
      setOptimisticQty(null)
    }
  }, [serverQty, optimisticQty])

  const cartQuantity = optimisticQty ?? serverQty
  const maxQuantity = Math.max(1, product.variants?.[0]?.stock ?? product.stock ?? 99)
  const isMutating = isAdding || isUpdating || isRemoving

  const applyOptimisticCart = (variantId: string, quantity: number, itemId?: string) => {
    const previous = queryClient.getQueryData<Cart>(cartKeys.all)
    queryClient.setQueryData<Cart>(
      cartKeys.all,
      patchCartQuantity(previous, {
        product,
        variantId,
        itemId,
        quantity,
      })
    )
    return previous
  }

  const setQuantity = (next: number) => {
    if (!defaultVariantId) return

    const clamped = Math.max(0, Math.min(maxQuantity, next))
    setOptimisticQty(clamped)
    const previous = applyOptimisticCart(defaultVariantId, clamped, cartItem?.id)

    const rollback = () => {
      setOptimisticQty(null)
      if (previous) queryClient.setQueryData(cartKeys.all, previous)
    }

    if (clamped <= 0) {
      if (cartItem && !cartItem.id.startsWith('optimistic-')) {
        removeCartItem(cartItem.id, { onError: rollback })
      } else if (!cartItem) {
        setOptimisticQty(null)
      }
      return
    }

    if (!cartItem || cartItem.id.startsWith('optimistic-')) {
      // Backend add increments — only fire once for the first unit while pending.
      if (!cartItem) {
        addToCart(
          { variantId: defaultVariantId, quantity: 1, openDrawer: false },
          { onError: rollback }
        )
      }
      return
    }

    updateCartItem(
      { itemId: cartItem.id, quantity: clamped },
      { onError: rollback }
    )
  }

  return {
    isWishlisted: typeof isWishlisted === 'boolean' ? isWishlisted : Boolean(product.isWishlisted),
    isAddingToCart: isMutating,
    hasDiscount,
    discountPercent,
    cartQuantity,
    maxQuantity,
    prefetch: () => prefetch(product.slug || product.id),
    toggleWishlist: toggle,
    addToCart: () => setQuantity(Math.max(1, cartQuantity + 1)),
    setQuantity,
  }
}
