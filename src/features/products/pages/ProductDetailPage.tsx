'use client'

import { useProductDetail } from '../hooks/useProductDetail'
import { ProductDetailSkeleton } from '../components/ProductDetailSkeleton'
import { ProductNotFound } from '../components/ProductNotFound'
import { ProductDetailContent } from '../components/ProductDetailContent'

export function ProductDetailPage() {
  const detail = useProductDetail()

  if (detail.isLoading) return <ProductDetailSkeleton />
  if (!detail.product) return <ProductNotFound />

  return (
    <ProductDetailContent
      product={detail.product}
      isWishlisted={detail.isWishlisted}
      onToggleWishlist={detail.toggleWishlist}
      onAddToCart={detail.onAddToCart}
      isAddingToCart={detail.isAddingToCart}
      canAddToCart={detail.canAddToCart}
      selectedImage={detail.selectedImage}
      onSelectImage={detail.setSelectedImage}
      quantity={detail.quantity}
      onQuantityChange={detail.setQuantity}
      showStickyBar={detail.showStickyBar}
      addSectionRef={detail.addSectionRef}
      breadcrumbItems={detail.breadcrumbItems}
      variantSelection={detail.variantSelection}
    />
  )
}
