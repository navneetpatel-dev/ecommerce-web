'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus, ShoppingCart } from 'lucide-react'
import type { ProductListItem } from '@/shared/api/types'
import { useAddToCart } from '@/features/cart/api/cart.queries'
import { usePrefetchProduct } from '../api/products.queries'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'

interface ProductCardProps {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart()
  const prefetch = usePrefetchProduct()

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => prefetch(product.id)}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-paper border border-line relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-ink/30 flex items-center justify-center">
            <Badge variant="secondary">Out of stock</Badge>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <VendorStrip vendor={product.vendor} size="sm" />
        <h3 className="font-sans text-sm font-medium text-ink line-clamp-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-base font-medium text-brand">₹{product.basePrice}</span>
        </div>
        <RatingStars value={product.avgRating} count={product.reviewCount} size="xs" />
      </div>
      <Button
        size="sm"
        className="mt-2 w-full opacity-0 group-hover:opacity-100 transition-opacity"
        disabled={product.stock === 0}
        onClick={(e) => {
          e.preventDefault()
          addToCart(product.id)
        }}
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
          </span>
        ) : (
          <>
            <Plus className="h-3 w-3" />
            <ShoppingCart className="h-3 w-3" />
          </>
        )}
      </Button>
    </Link>
  )
}
