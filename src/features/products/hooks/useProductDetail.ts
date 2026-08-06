'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProduct } from '../api/products.queries'
import { useWishlistToggle } from './useWishlistToggle'
import { useVariantSelection } from './useVariantSelection'
import { useAddToCart } from '@/features/cart/api/cart.queries'
import { trackRecentlyViewed } from '../utils/recently-viewed'
import { cartLineQuantityMax, clampCartQuantity } from '@/shared/constants/cart'
import { usePublicSettings } from '@/shared/hooks/usePublicSettings'
import { PATHS } from '@/shared/constants/paths'
import type { ProductDetail } from '@/shared/api/types'

export function useProductDetail() {
  const params = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(params?.slug || '')
  const { data: settings } = usePublicSettings()
  const { isWishlisted, toggle } = useWishlistToggle(product?.id)
  const addToCart = useAddToCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const addSectionRef = useRef<HTMLDivElement>(null)

  const variants = product?.variants ?? []
  const variantStockTotal = variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0)
  const baseStock = Number(product?.stock ?? 0) || variantStockTotal
  const basePrice = Number(product?.basePrice ?? 0)

  const selection = useVariantSelection(variants, basePrice, baseStock)

  useEffect(() => {
    if (!product) return
    trackRecentlyViewed(product)
  }, [product])

  useEffect(() => {
    const handleScroll = () => {
      if (!addSectionRef.current) return
      const rect = addSectionRef.current.getBoundingClientRect()
      setShowStickyBar(rect.bottom < 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const resolvedVariantId =
    selection.variantId ?? (variants.length === 1 ? variants[0]?.id : null) ?? null

  const selectedStock = selection.variantId
    ? Number(selection.currentStock || 0)
    : variants.length === 1
      ? Number(variants[0]?.stock || 0)
      : baseStock

  const needsOptionSelection = variants.length > 1 && !selection.variantId

  const maxQuantity = cartLineQuantityMax(selectedStock)

  useEffect(() => {
    setQuantity((current) => Math.min(current, maxQuantity))
  }, [maxQuantity])

  const canAddToCart =
    Boolean(product) &&
    Boolean(resolvedVariantId) &&
    selectedStock > 0 &&
    !needsOptionSelection

  const handleQuantityChange = useCallback(
    (qty: number) => {
      setQuantity(Math.min(maxQuantity, clampCartQuantity(qty)))
    },
    [maxQuantity],
  )

  const handleAddToCart = useCallback(
    (qty: number) => {
      if (!resolvedVariantId || needsOptionSelection) return
      addToCart.mutate({
        variantId: resolvedVariantId,
        quantity: Math.min(maxQuantity, clampCartQuantity(qty)),
      })
    },
    [addToCart, maxQuantity, needsOptionSelection, resolvedVariantId],
  )

  const breadcrumbItems = product
    ? [
        { label: 'Products', href: PATHS.products },
        ...(product.categoryId
          ? [
              {
                label:
                  (product as ProductDetail & { category?: { name?: string }; categoryName?: string })
                    .category?.name ||
                  (product as ProductDetail & { categoryName?: string }).categoryName ||
                  'Category',
                href: `${PATHS.products}?categoryId=${product.categoryId}`,
              },
            ]
          : []),
        { label: product.name },
      ]
    : []

  return {
    product,
    isLoading,
    freeShippingThreshold: settings?.freeShippingThreshold,
    returnWindowDays: settings?.defaultReturnWindow,
    isWishlisted: isWishlisted || false,
    toggleWishlist: toggle,
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity: handleQuantityChange,
    maxQuantity,
    showStickyBar,
    addSectionRef,
    breadcrumbItems,
    isAddingToCart: addToCart.isPending,
    canAddToCart,
    needsOptionSelection,
    onAddToCart: handleAddToCart,
    variantSelection: {
      attributeGroups: selection.attributeGroups,
      currentPrice: Number(selection.currentPrice || basePrice),
      currentStock: Number(selection.currentStock || 0),
      basePrice,
      hasPriceChange: selection.hasPriceChange,
      isAvailable: selection.isAvailable,
      isActive: selection.isActive,
      onSelectValue: selection.selectValue,
    },
  }
}
