'use client'
import { useParams } from 'next/navigation'
import { useProduct } from '../api/products.queries'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { ProductDetailSkeleton } from '../components/ProductDetailSkeleton'
import { ProductNotFound } from '../components/ProductNotFound'
import { ProductDetailContent } from '../components/ProductDetailContent'

export function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(params?.slug || '')
  const { isWishlisted, toggle } = useWishlistToggle(product?.id)

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) return <ProductNotFound />

  return (
    <ProductDetailContent
      product={product}
      isWishlisted={isWishlisted || false}
      onToggleWishlist={toggle}
    />
  )
}
