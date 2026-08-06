'use client'

import { Trash2 } from 'lucide-react'
import { EmptyWishlistState } from './EmptyWishlistState'
import { SkeletonGrid } from '@/shared/components/Skeletons'
import { ProductCardContainer } from '@/features/products/containers/ProductCardContainer'
import { Badge } from '@/shared/components/ui/badge'
import { LABELS } from '@/shared/constants/labels'
import { UNAVAILABLE_REASON } from '@/shared/constants/statuses'
import { cn } from '@/shared/utils/cn'
import type { WishlistPageItem } from '../hooks/useWishlistPage'
import type { UnavailableReason } from '@/shared/constants/statuses'

function unavailableLabel(reason: UnavailableReason | null | undefined): string {
  switch (reason) {
    case UNAVAILABLE_REASON.OUT_OF_STOCK:
      return LABELS.unavailableReasonOutOfStock
    case UNAVAILABLE_REASON.PRODUCT_UNPUBLISHED:
      return LABELS.unavailableReasonProductUnpublished
    case UNAVAILABLE_REASON.VENDOR_UNAVAILABLE:
      return LABELS.unavailableReasonVendorUnavailable
    default:
      return LABELS.unavailableGeneric
  }
}

interface WishlistViewProps {
  isLoading: boolean
  isEmpty: boolean
  items: WishlistPageItem[]
  onRemoveItem: (productId: string) => void
}

export function WishlistView({ isLoading, isEmpty, items, onRemoveItem }: WishlistViewProps) {
  if (isLoading) {
    return (
      <div className="storefront-container py-8">
        <SkeletonGrid count={4} />
      </div>
    )
  }

  if (isEmpty) return <EmptyWishlistState />

  return (
    <div className="storefront-container py-8">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {items.map(({ wishlistItem, product, isAvailable }) => {
          if (!isAvailable) {
            return (
              <div
                key={wishlistItem.id}
                className={cn(
                  'relative rounded-sm border border-line bg-surface',
                  'opacity-60 grayscale'
                )}
              >
                <ProductCardContainer
                  product={product}
                  showWishlist={false}
                />
                <div className="absolute inset-0 flex flex-col items-start justify-start p-3 bg-transparent pointer-events-none">
                  <Badge variant="destructive" className="text-[0.6875rem] pointer-events-none">
                    {unavailableLabel(wishlistItem.unavailableReason)}
                  </Badge>
                </div>
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-elevation-1 text-ink-muted transition-colors hover:bg-danger-subtle hover:text-danger"
                  aria-label={`Remove ${product.name} from wishlist`}
                  onClick={() => onRemoveItem(wishlistItem.productId)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          }

          return (
            <ProductCardContainer
              key={product.id}
              product={product}
              quickAddLabel="Move to cart"
              showWishlist
            />
          )
        })}
      </div>
    </div>
  )
}
