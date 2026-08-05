'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProduct } from '../api/products.queries'
import { useWishlistToggle } from './useWishlistToggle'
import { useVariantSelection } from './useVariantSelection'
import { useAddToCart } from '@/features/cart/api/cart.queries'
import { trackRecentlyViewed } from '../utils/recently-viewed'
import type { ProductDetail } from '@/shared/api/types'

export function useProductDetail() {
  const params = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(params?.slug || '')
  const { isWishlisted, toggle } = useWishlistToggle(product?.id)
  const addToCart = useAddToCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const addSectionRef = useRef<HTMLDivElement>(null)

  const variants = product?.variants ?? []
  const selection = useVariantSelection(
    variants,
    product?.basePrice ?? 0,
    product?.stock ?? 0
  )

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

  const canAddToCart =
    Boolean(product) &&
    (product?.stock ?? 0) > 0 &&
    Boolean(resolvedVariantId) &&
    (variants.length <= 1 || selection.variantId != null)

  const handleAddToCart = useCallback(
    (qty: number) => {
      if (!resolvedVariantId) return
      addToCart.mutate({ variantId: resolvedVariantId, quantity: qty })
    },
    [addToCart, resolvedVariantId]
  )

  const breadcrumbItems = product
    ? [
        { label: 'Products', href: '/products' },
        ...(product.categoryId
          ? [
              {
                label:
                  (product as ProductDetail & { category?: { name?: string }; categoryName?: string })
                    .category?.name ||
                  (product as ProductDetail & { categoryName?: string }).categoryName ||
                  'Category',
                href: `/products?categoryId=${product.categoryId}`,
              },
            ]
          : []),
        { label: product.name },
      ]
    : []

  return {
    product,
    isLoading,
    isWishlisted: isWishlisted || false,
    toggleWishlist: toggle,
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    showStickyBar,
    addSectionRef,
    breadcrumbItems,
    isAddingToCart: addToCart.isPending,
    canAddToCart,
    onAddToCart: handleAddToCart,
    variantSelection: {
      attributeGroups: selection.attributeGroups,
      currentPrice: selection.currentPrice,
      currentStock: selection.currentStock,
      basePrice: product?.basePrice ?? 0,
      hasPriceChange: selection.hasPriceChange,
      isAvailable: selection.isAvailable,
      isActive: selection.isActive,
      onSelectValue: selection.selectValue,
    },
  }
}
