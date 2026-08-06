'use client'

import { ImageGalleryContainer } from '@/shared/containers/ImageGalleryContainer'
import { ProductInfo } from './ProductInfo'
import { VariantSelector } from './VariantSelector'
import { ProductReviewsContainer } from '@/features/reviews/containers/ProductReviewsContainer'
import { ShareButtonContainer } from '@/shared/containers/ShareButtonContainer'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Button } from '@/shared/components/ui/button'
import { Breadcrumbs } from '@/shared/components/Breadcrumbs'
import { QuantitySelector } from '@/shared/components/QuantitySelector'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'
import { Heart, Truck, RotateCcw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cartLineQuantityMax } from '@/shared/constants/cart'
import type { RefObject } from 'react'

interface Product {
  id: string
  slug?: string
  name: string
  imageUrl: string
  images?: Array<{ id: string; url: string; isPrimary: boolean }>
  vendor?: { id: string; businessName: string; slug: string; logoUrl: string | null } | null
  avgRating?: number
  reviewCount?: number
  variants?: Array<{ id: string; sku?: string; stock?: number }>
  basePrice: number
  stock?: number
  description?: string
  categoryName?: string
  category?: { name?: string }
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface VariantSelectionProps {
  attributeGroups: Record<string, string[]>
  currentPrice: number
  currentStock: number
  basePrice: number
  hasPriceChange: boolean
  isAvailable: (key: string, value: string) => boolean
  isActive: (key: string, value: string) => boolean
  onSelectValue: (key: string, value: string) => void
}

interface ProductDetailContentProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: () => void
  onAddToCart?: (quantity: number) => void
  isAddingToCart?: boolean
  canAddToCart?: boolean
  needsOptionSelection?: boolean
  selectedImage: number
  onSelectImage: (index: number) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
  maxQuantity?: number
  showStickyBar: boolean
  addSectionRef: RefObject<HTMLDivElement | null>
  breadcrumbItems: BreadcrumbItem[]
  variantSelection: VariantSelectionProps
}

export function ProductDetailContent({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  isAddingToCart,
  canAddToCart = true,
  needsOptionSelection = false,
  selectedImage,
  onSelectImage,
  quantity,
  onQuantityChange,
  maxQuantity,
  showStickyBar,
  addSectionRef,
  breadcrumbItems,
  variantSelection,
}: ProductDetailContentProps) {
  const displayPrice = Number(variantSelection.currentPrice || product.basePrice || 0)
  const displayStock = Number(variantSelection.currentStock || product.stock || 0)
  const quantityMax = maxQuantity ?? cartLineQuantityMax(displayStock)
  const addDisabled = Boolean(!canAddToCart || isAddingToCart)
  const reviewCount = product.reviewCount ?? 0
  const avgRating = product.avgRating ?? 0

  const addToCartLabel = needsOptionSelection
    ? 'Select options'
    : displayStock === 0
      ? 'Out of stock'
      : 'Add to Cart'

  const addToCartHint = needsOptionSelection
    ? 'Select product options to add this item to your cart.'
    : displayStock === 0
      ? 'This item is currently out of stock.'
      : isAddingToCart
        ? 'Adding to your cart…'
        : ''

  return (
    <div className="storefront-container py-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        <ImageGalleryContainer
          mainImageUrl={product.imageUrl}
          images={product.images}
          selectedIndex={selectedImage}
          onSelect={onSelectImage}
          productName={product.name}
        />

        <div className="md:col-span-5" ref={addSectionRef}>
          <div className="space-y-6 lg:sticky lg:top-[88px]">
            {product.vendor && (
              <VendorStrip vendor={product.vendor} size="md" rating={avgRating} />
            )}

            {(product.category?.name || product.categoryName) && (
              <TextEyebrow className="-mb-2">
                {product.category?.name ?? product.categoryName}
              </TextEyebrow>
            )}

            <h1 className="font-display text-ink leading-tight" style={{ fontSize: 'var(--text-display-sm)' }}>
              {product.name}
            </h1>

            <RatingStars value={avgRating} count={reviewCount} size="md" />

            <div aria-live="polite">
              <span className="font-sans text-[1.75rem] font-semibold text-brand">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {product.variants && product.variants.length > 0 && (
              <VariantSelector
                attributeGroups={variantSelection.attributeGroups}
                currentPrice={variantSelection.currentPrice}
                currentStock={variantSelection.currentStock}
                basePrice={variantSelection.basePrice}
                hasPriceChange={variantSelection.hasPriceChange}
                isAvailable={variantSelection.isAvailable}
                isActive={variantSelection.isActive}
                onSelectValue={variantSelection.onSelectValue}
                showAddToCart={false}
              />
            )}

            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              max={Math.max(quantityMax, 1)}
            />

            {!canAddToCart && needsOptionSelection && (
              <p className="text-[0.8125rem] text-ink-muted">Select all options to add this item to your cart.</p>
            )}

            <div className="flex gap-3">
              <DisabledActionHint disabled={addDisabled} message={addToCartHint} className="min-w-0 flex-1">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={addDisabled}
                  onClick={() => onAddToCart?.(quantity)}
                  loading={isAddingToCart}
                >
                  {addToCartLabel}
                </Button>
              </DisabledActionHint>
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
              <ShareButtonContainer
                title={product.name}
                url={`/products/${product.slug ?? product.id}`}
              />
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

      <div className="mt-12 md:mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="max-w-[65ch]">
              <ProductInfo product={product} />
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="max-w-[65ch] text-[0.9375rem] text-ink-muted space-y-2">
              <p>SKU: {product?.variants?.[0]?.sku ?? 'Not available'}</p>
              <p>Category: {product.category?.name ?? product.categoryName ?? 'General'}</p>
              <p>Stock: {displayStock > 0 ? `${displayStock} available` : 'Out of stock'}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6" id="reviews">
            <ProductReviewsContainer productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>

      {(showStickyBar && (displayStock > 0 || needsOptionSelection)) && (
        <div className="fixed bottom-14 left-0 right-0 z-30 p-4 bg-surface border-t border-line shadow-elevation-3 md:hidden">
          <DisabledActionHint disabled={addDisabled} message={addToCartHint} className="w-full">
            <Button
              size="lg"
              className="w-full"
              disabled={addDisabled}
              onClick={() => onAddToCart?.(quantity)}
              loading={isAddingToCart}
            >
              {needsOptionSelection
                ? 'Select options'
                : `Add to Cart — ₹${displayPrice.toLocaleString('en-IN')}`}
            </Button>
          </DisabledActionHint>
        </div>
      )}
    </div>
  )
}
