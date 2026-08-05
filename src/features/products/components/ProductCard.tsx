'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Plus } from 'lucide-react'
import type { ProductListItem } from '@/shared/api/types'
import { useAddToCart } from '@/features/cart/api/cart.queries'
import { usePrefetchProduct } from '../api/products.queries'
import { useWishlistToggle } from '../hooks/useWishlistToggle'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { DiscountBadge } from '@/shared/components/DiscountBadge'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'

interface ProductCardProps {
  product: ProductListItem
  quickAddLabel?: string
  showWishlist?: boolean
  showQuickAdd?: boolean
}

export function ProductCard({
  product,
  quickAddLabel = 'Quick add',
  showWishlist = true,
  showQuickAdd = true,
}: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart()
  const prefetch = usePrefetchProduct()
  const { isWishlisted, toggle } = useWishlistToggle(product.isWishlisted ? product.id : undefined)
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice

  return (
    <div className="group relative">
      <Link
        href={`/products/${product.slug}`}
        className="block"
        onMouseEnter={() => prefetch(product.id)}
      >
        {/* Image */}
        <div className="aspect-square rounded-md overflow-hidden bg-paper border border-line relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />

          {/* Scarcity badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-accent text-white text-[0.8125rem] font-semibold rounded-sm px-2 py-1">
              Only {product.stock} left
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-overlay flex items-center justify-center">
              <span className="bg-surface text-ink text-[0.8125rem] font-medium rounded-sm px-3 py-1.5">
                Out of stock
              </span>
            </div>
          )}

          {/* Wishlist heart */}
          {showWishlist && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggle()
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

          {/* Quick add overlay (desktop hover) */}
          {showQuickAdd && product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
              <Button
                size="sm"
                className="w-full rounded-full bg-surface/90 hover:bg-surface backdrop-blur-xs text-ink border border-line"
                disabled={isPending}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart(product.id)
                }}
              >
                {isPending ? (
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

      {/* Info */}
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
                -{Math.round(((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100)}%
              </DiscountBadge>
            </>
          )}
        </div>
        <RatingStars value={product.avgRating} count={product.reviewCount} size="sm" />
      </div>

      {/* Quick add (mobile — always visible below price) */}
      {showQuickAdd && product.stock > 0 && (
        <div className="mt-2 md:hidden">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              addToCart(product.id)
            }}
          >
            {isPending ? (
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
  )
}
