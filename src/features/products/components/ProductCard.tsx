'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Plus } from 'lucide-react'
import { Checkbox } from '@/shared/components/ui/checkbox'
import type { ProductListItem } from '@/shared/api/types'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { DiscountBadge } from '@/shared/components/DiscountBadge'
import { ProductImagePlaceholder } from '@/shared/components/ProductImagePlaceholder'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'

interface ProductCardProps {
  product: ProductListItem
  quickAddLabel?: string
  showWishlist?: boolean
  showQuickAdd?: boolean
  compareMode?: boolean
  isCompared?: boolean
  isWishlisted?: boolean
  isAddingToCart?: boolean
  hasDiscount?: boolean
  discountPercent?: number
  onPrefetch?: () => void
  onToggleWishlist?: () => void
  onAddToCart?: () => void
  onToggleCompare?: (product: ProductListItem) => void
}

export function ProductCard({
  product,
  quickAddLabel = 'Quick add',
  showWishlist = true,
  showQuickAdd = true,
  compareMode = false,
  isCompared = false,
  isWishlisted = false,
  isAddingToCart = false,
  hasDiscount = false,
  discountPercent = 0,
  onPrefetch,
  onToggleWishlist,
  onAddToCart,
  onToggleCompare,
}: ProductCardProps) {
  return (
    <div className="group relative">
      <Link
        href={`/products/${product.slug}`}
        className="block"
        onMouseEnter={onPrefetch}
      >
        <div className="aspect-square rounded-md overflow-hidden bg-paper border border-line relative">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          ) : (
            <ProductImagePlaceholder />
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-accent-subtle text-accent text-[0.8125rem] font-semibold rounded-sm px-2 py-1">
              Only {product.stock} left
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-overlay flex items-center justify-center">
              <span className="bg-surface text-ink text-[0.8125rem] font-medium rounded-sm px-3 py-1.5">
                Out of stock
              </span>
            </div>
          )}

          {showWishlist && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist?.()
              }}
              className={cn(
                'absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-xs hover:bg-surface transition-colors',
                isWishlisted ? 'text-danger' : 'text-ink-muted'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={18}
                className={cn(
                  isWishlisted && 'fill-current',
                  isWishlisted && 'animate-pulse-scale'
                )}
              />
            </button>
          )}

          {showQuickAdd && product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
              <Button
                size="sm"
                className="w-full rounded-full bg-surface/90 hover:bg-surface backdrop-blur-xs text-ink border border-line"
                disabled={isAddingToCart}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToCart?.()
                }}
              >
                {isAddingToCart ? (
                  <span className="animate-spin h-4 w-4 border-2 border-ink border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Plus size={16} />
                    {quickAddLabel}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <VendorStrip vendor={product.vendor} size="sm" />
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-sans text-[0.9375rem] font-medium text-ink line-clamp-2 group-hover:text-brand transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-[0.9375rem] font-semibold text-brand">
            ₹{product.basePrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <>
              <span className="font-sans text-[0.8125rem] text-ink-faint line-through">
                ₹{product.compareAtPrice!.toLocaleString('en-IN')}
              </span>
              <DiscountBadge>
                -{discountPercent}%
              </DiscountBadge>
            </>
          )}
        </div>
        <RatingStars value={product.avgRating} count={product.reviewCount} size="sm" />
      </div>

      {showQuickAdd && product.stock > 0 && (
        <div className="mt-2 md:hidden">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            disabled={isAddingToCart}
            onClick={(e) => {
              e.preventDefault()
              onAddToCart?.()
            }}
          >
            {isAddingToCart ? (
              <span className="animate-spin h-4 w-4 border-2 border-ink border-t-transparent rounded-full" />
            ) : (
              <>
                <Plus size={16} />
                {quickAddLabel}
              </>
            )}
          </Button>
        </div>
      )}

      {compareMode && (
        <label className="mt-2 flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <Checkbox
            checked={isCompared}
            onCheckedChange={() => onToggleCompare?.(product)}
            aria-label={`Compare ${product.name}`}
          />
          Compare
        </label>
      )}
    </div>
  )
}
