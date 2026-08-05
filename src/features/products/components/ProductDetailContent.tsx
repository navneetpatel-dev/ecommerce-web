'use client'
import { useState, useRef, useEffect } from 'react'
import { VariantSelector } from './VariantSelector'
import { ImageGallery } from './ImageGallery'
import { ProductInfo } from './ProductInfo'
import { ProductReviews } from '@/features/reviews/components/ProductReviews'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { Button } from '@/shared/components/ui/button'
import { Breadcrumbs } from '@/shared/components/Breadcrumbs'
import { QuantitySelector } from '@/shared/components/QuantitySelector'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'
import { Heart, Truck, RotateCcw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { ProductListItem } from '@/shared/api/types'

interface Product {
  id: string
  slug?: string
  name: string
  imageUrl: string
  images?: any[]
  vendor: any
  avgRating: number
  reviewCount: number
  variants?: any[]
  basePrice: number
  stock: number
  description?: string
  categoryName?: string
  [key: string]: any
}

interface ProductDetailContentProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: () => void
  onAddToCart?: (quantity: number) => void
  isAddingToCart?: boolean
}

export function ProductDetailContent({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  isAddingToCart,
}: ProductDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const addSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (addSectionRef.current) {
        const rect = addSectionRef.current.getBoundingClientRect()
        setShowStickyBar(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const recentKey = 'recently-viewed-products'
    const productSnapshot: ProductListItem = {
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      basePrice: product.basePrice,
      avgRating: product.avgRating,
      reviewCount: product.reviewCount,
      imageUrl: product.imageUrl,
      stock: product.stock,
      vendor: product.vendor,
      compareAtPrice: product.compareAtPrice,
    }
    try {
      const current = JSON.parse(localStorage.getItem(recentKey) || '[]') as ProductListItem[]
      const withoutCurrent = current.filter((item) => item.id !== productSnapshot.id)
      const next = [productSnapshot, ...withoutCurrent].slice(0, 12)
      localStorage.setItem(recentKey, JSON.stringify(next))
    } catch {
      localStorage.setItem(recentKey, JSON.stringify([productSnapshot]))
    }
  }, [product])

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
    ...(product.categoryName ? [{ label: product.categoryName, href: `/products?category=${product.categoryName.toLowerCase()}` }] : []),
    { label: product.name },
  ]

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        <ImageGallery
          mainImageUrl={product.imageUrl}
          images={product.images}
          selectedIndex={selectedImage}
          onSelect={setSelectedImage}
          productName={product.name}
        />

        {/* Purchase Panel */}
        <div className="md:col-span-5" ref={addSectionRef}>
          <div className="space-y-6 lg:sticky lg:top-[88px]">
            <VendorStrip vendor={product.vendor} size="md" rating={product.avgRating} />

            <h1 className="font-display text-ink leading-tight" style={{ fontSize: 'var(--text-display-sm)' }}>
              {product.name}
            </h1>

            <RatingStars value={product.avgRating} count={product.reviewCount} size="md" />

            <div aria-live="polite">
              <span className="font-sans text-[1.75rem] font-semibold text-brand">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
            </div>

            {product.variants && product.variants.length > 0 && (
              <VariantSelector variants={product.variants} basePrice={product.basePrice} baseStock={product.stock} />
            )}

            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
            />

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={product.stock === 0 || isAddingToCart}
                onClick={() => onAddToCart?.(quantity)}
                loading={isAddingToCart}
              >
                {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="shrink-0"
                onClick={onToggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={20}
                  className={cn(
                    isWishlisted ? 'fill-danger text-danger' : 'text-ink-muted',
                    isWishlisted && 'animate-pulse-scale'
                  )}
                />
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t border-line">
              <div className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
                <Truck size={16} />
                <span>Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
                <RotateCcw size={16} />
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 md:mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="max-w-[65ch]">
              <ProductInfo product={product} />
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="max-w-[65ch] text-[0.9375rem] text-ink-muted space-y-2">
              <p>SKU: {product?.variants?.[0]?.sku ?? 'Not available'}</p>
              <p>Category: {product.categoryName ?? 'General'}</p>
              <p>Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6" id="reviews">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile sticky Add to Cart */}
      {showStickyBar && product.stock > 0 && (
        <div className="fixed bottom-14 left-0 right-0 z-30 p-4 bg-surface border-t border-line shadow-elevation-3 md:hidden">
          <Button
            size="lg"
            className="w-full"
            onClick={() => onAddToCart?.(quantity)}
            loading={isAddingToCart}
          >
            Add to Cart — ₹{product.basePrice.toLocaleString('en-IN')}
          </Button>
        </div>
      )}
    </div>
  )
}
