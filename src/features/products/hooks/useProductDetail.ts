'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProduct } from '../api/products.queries'
import { useWishlistToggle } from './useWishlistToggle'
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

  const handleAddToCart = useCallback(
    (qty: number) => {
      if (!product) return
      const variantId = product.variants?.[0]?.id ?? product.id
      addToCart.mutate(variantId)
      void qty
    },
    [addToCart, product]
  )

  const breadcrumbItems = product
    ? [
        { label: 'Products', href: '/products' },
        ...((product as ProductDetail & { categoryName?: string }).categoryName
          ? [
              {
                label: (product as ProductDetail & { categoryName?: string }).categoryName!,
                href: `/products?category=${(product as ProductDetail & { categoryName?: string }).categoryName!.toLowerCase()}`,
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
    onAddToCart: handleAddToCart,
  }
}
