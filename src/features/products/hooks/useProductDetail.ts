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
import { LABELS } from '@/shared/constants/labels'
import { useCategories } from '@/features/categories'
import type { Category, ProductDetail } from '@/shared/api/types'

export function useProductDetail() {
  const params = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(params?.slug || '')
  const { data: categories = [] } = useCategories()
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

  useEffect(() => {
    setSelectedImage(0)
  }, [resolvedVariantId])

  const selectedStock = selection.variantId
    ? Number(selection.currentStock || 0)
    : variants.length === 1
      ? Number(variants[0]?.stock || 0)
      : 0

  const hasAttributeOptions = Object.keys(selection.attributeGroups).length > 0
  const needsOptionSelection = hasAttributeOptions && !selection.hasCompleteSelection
  const variantUnavailable =
    hasAttributeOptions && selection.hasCompleteSelection && !selection.matchedVariant

  const maxQuantity = cartLineQuantityMax(selectedStock)

  useEffect(() => {
    setQuantity((current) => Math.min(current, maxQuantity))
  }, [maxQuantity])

  const canAddToCart =
    Boolean(product) &&
    Boolean(resolvedVariantId) &&
    selectedStock > 0 &&
    !needsOptionSelection &&
    !variantUnavailable

  const handleQuantityChange = useCallback(
    (qty: number) => {
      setQuantity(Math.min(maxQuantity, clampCartQuantity(qty)))
    },
    [maxQuantity],
  )

  const handleAddToCart = useCallback(
    (qty: number) => {
      if (!resolvedVariantId || needsOptionSelection || variantUnavailable) return
      addToCart.mutate({
        variantId: resolvedVariantId,
        quantity: Math.min(maxQuantity, clampCartQuantity(qty)),
        openDrawer: false,
      })
    },
    [addToCart, maxQuantity, needsOptionSelection, resolvedVariantId, variantUnavailable],
  )

  const breadcrumbItems = product
    ? [
        { label: LABELS.allProducts, href: PATHS.products },
        ...(() => {
          const byId = new Map<string, Category>()
          const index = (nodes: Category[]) => {
            for (const node of nodes) {
              byId.set(node.id, node)
              if (node.children?.length) index(node.children)
            }
          }
          index(categories)

          type CatNode = { id: string; name: string; slug: string; parentId: string | null }
          const chain: CatNode[] = []
          const nested = (
            product as ProductDetail & {
              category?: CatNode & { parent?: (CatNode & { parent?: CatNode | null }) | null }
            }
          ).category

          if (nested?.name) {
            let cursor: (CatNode & { parent?: CatNode | null }) | null | undefined = nested
            while (cursor) {
              chain.unshift({
                id: cursor.id,
                name: cursor.name,
                slug: cursor.slug,
                parentId: cursor.parentId ?? null,
              })
              cursor = cursor.parent ?? null
            }
          } else if (product.categoryId) {
            let cursorId: string | null = product.categoryId
            while (cursorId) {
              const node = byId.get(cursorId)
              if (!node) break
              chain.unshift({
                id: node.id,
                name: node.name,
                slug: node.slug,
                parentId: node.parentId,
              })
              cursorId = node.parentId
            }
          }

          return chain.map((node, index) => ({
            label: node.name,
            href: PATHS.category(...chain.slice(0, index + 1).map((item) => item.slug)),
          }))
        })(),
        { label: product.name },
      ]
    : []

  return {
    product,
    isLoading,
    freeShippingThreshold:
      product?.vendorFreeShippingThreshold ?? settings?.freeShippingThreshold,
    returnWindowDays: product?.returnWindowDays ?? settings?.defaultReturnWindow,
    returnsAllowed: product?.returnsAllowed,
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
    variantUnavailable,
    onAddToCart: handleAddToCart,
    variantSelection: {
      attributeGroups: selection.attributeGroups,
      currentPrice: Number(selection.currentPrice || basePrice),
      currentStock: Number(selection.currentStock || 0),
      basePrice,
      hasPriceChange: selection.hasPriceChange,
      matchedVariant: selection.matchedVariant,
      isAvailable: selection.isAvailable,
      isActive: selection.isActive,
      onSelectValue: selection.selectValue,
    },
  }
}
