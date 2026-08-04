import Link from 'next/link'
import Image from 'next/image'
import type { WishlistItem } from '@/shared/api/types'
import { hasPriceDropped } from '../utils/wishlist.utils'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { ShoppingCart, Trash2 } from 'lucide-react'

interface WishlistCardProps {
  item: WishlistItem
  onMoveToCart: (productId: string) => void
  onRemove: (productId: string) => void
}

export function WishlistCard({ item, onMoveToCart, onRemove }: WishlistCardProps) {
  const priceDropped = hasPriceDropped(item)

  return (
    <div className="flex gap-4 p-4 border border-line rounded-lg bg-surface">
      <Link href={`/products/${item.product.slug}`} className="shrink-0">
        <Image src={item.product.imageUrl} alt={item.product.name} width={96} height={96} className="rounded-md object-cover" />
      </Link>
      <div className="flex-1 min-w-0 space-y-1">
        <VendorStrip vendor={item.product.vendor} size="sm" />
        <Link href={`/products/${item.product.slug}`} className="text-sm font-medium line-clamp-2 hover:text-brand">
          {item.product.name}
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-semibold text-brand">₹{item.product.basePrice}</span>
          {priceDropped && (
            <>
              <Badge variant="success" className="text-xs">Price dropped!</Badge>
              <span className="font-mono text-xs text-ink/40 line-through">₹{item.priceAtAdd}</span>
            </>
          )}
        </div>
        <RatingStars value={item.product.avgRating} size="xs" />
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => onMoveToCart(item.productId)}>
            <ShoppingCart className="h-3 w-3" /> Move to cart
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRemove(item.productId)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
