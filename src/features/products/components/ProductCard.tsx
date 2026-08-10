'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Heart, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Checkbox } from '@/shared/components/ui/checkbox'
import type { ProductListItem } from '@/shared/api/types'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { DiscountBadge } from '@/shared/components/DiscountBadge'
import { MediaImage } from '@/shared/components/MediaImage'
import { Button } from '@/shared/components/ui/button'
import { CardQuantityControl } from './CardQuantityControl'
import { cn } from '@/shared/utils/cn'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

interface ProductCardProps {
  product: ProductListItem
  quickAddLabel?: string
  showWishlist?: boolean
  showQuickAdd?: boolean
  compareMode?: boolean
  isCompared?: boolean
  isWishlisted?: boolean
  isAddingToCart?: boolean
  cartQuantity?: number
  maxQuantity?: number
  hasDiscount?: boolean
  discountPercent?: number
  onPrefetch?: () => void
  onToggleWishlist?: () => void
  onAddToCart?: () => void
  onQuantityChange?: (quantity: number) => void
  onToggleCompare?: (product: ProductListItem) => void
}

const controlMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.2, 0, 0, 1] as const },
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
  cartQuantity = 0,
  maxQuantity = 99,
  hasDiscount = false,
  discountPercent = 0,
  onPrefetch,
  onToggleWishlist,
  onAddToCart,
  onQuantityChange,
  onToggleCompare,
}: ProductCardProps) {
  const [imageUnavailable, setImageUnavailable] = useState(!product.imageUrl)
  const handleUnavailableChange = useCallback((unavailable: boolean) => {
    setImageUnavailable(unavailable)
  }, [])

  const inCart = cartQuantity > 0
  const canQuickAdd = showQuickAdd && product.stock > 0

  const renderQuickAddButton = (variant: 'overlay' | 'mobile') => (
    <Button
      size="sm"
      variant={variant === 'mobile' ? 'secondary' : 'default'}
      className={cn(
        'w-full',
        variant === 'overlay' &&
          'rounded-full bg-surface/90 hover:bg-surface backdrop-blur-xs text-ink border border-line'
      )}
      disabled={isAddingToCart}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onAddToCart?.()
      }}
    >
      {isAddingToCart && !inCart ? (
        <span className="animate-spin h-4 w-4 border-2 border-ink border-t-transparent rounded-full" />
      ) : (
        <>
          <Plus size={16} />
          {quickAddLabel}
        </>
      )}
    </Button>
  )

  const renderControls = (variant: 'overlay' | 'mobile') => (
    <AnimatePresence mode="wait" initial={false}>
      {inCart ? (
        <motion.div key="qty" className="w-full" {...controlMotion}>
          <CardQuantityControl
            value={cartQuantity}
            max={maxQuantity}
            onChange={(qty) => onQuantityChange?.(qty)}
          />
        </motion.div>
      ) : (
        <motion.div key="add" className="w-full" {...controlMotion}>
          {renderQuickAddButton(variant)}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="group relative">
      <Link
        href={PATHS.product(product.slug)}
        className="block"
        onMouseEnter={onPrefetch}
      >
        <div
          className={cn(
            'aspect-square rounded-md overflow-hidden bg-paper border border-line relative',
            'transition-colors duration-200',
            imageUnavailable && 'group-hover:border-brand'
          )}
        >
          <MediaImage
            src={product.imageUrl}
            alt={product.name}
            unavailableLabel={`${product.name} image not available`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            imageClassName="object-cover group-hover:scale-105 transition-transform duration-300"
            onUnavailableChange={handleUnavailableChange}
          />

          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-accent-subtle text-accent text-[0.8125rem] font-semibold rounded-sm px-2 py-1">
              Only {product.stock} left
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-overlay flex items-center justify-center">
              <span className="bg-surface text-ink text-[0.8125rem] font-medium rounded-sm px-3 py-1.5">
                {LABELS.outOfStock}
              </span>
            </div>
          )}

          {showWishlist && (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist?.()
              }}
              className={cn(
                'absolute top-2 right-2 h-8 w-8 min-h-8 max-h-8 rounded-full bg-surface/80 backdrop-blur-xs hover:bg-surface',
                isWishlisted ? 'text-danger' : 'text-ink-muted'
              )}
              aria-label={isWishlisted ? LABELS.removeFromWishlist : LABELS.addToWishlist}
            >
              <Heart
                size={18}
                className={cn(
                  isWishlisted && 'fill-current',
                  isWishlisted && 'animate-pulse-scale'
                )}
              />
            </Button>
          )}

          {canQuickAdd && (
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 hidden p-3 md:flex',
                'transition-[opacity,transform] duration-200',
                inCart
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
              )}
            >
              {renderControls('overlay')}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <VendorStrip vendor={product.vendor} size="sm" />
        <Link href={PATHS.product(product.slug)}>
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

      {canQuickAdd && (
        <div className="mt-2 md:hidden">
          {renderControls('mobile')}
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
