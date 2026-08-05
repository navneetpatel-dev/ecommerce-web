'use client'

import { useProductCard } from '../hooks/useProductCard'
import { ProductCard } from '../components/ProductCard'
import type { ProductListItem } from '@/shared/api/types'

interface ProductCardContainerProps {
  product: ProductListItem
  quickAddLabel?: string
  showWishlist?: boolean
  showQuickAdd?: boolean
  compareMode?: boolean
  isCompared?: boolean
  onToggleCompare?: (product: ProductListItem) => void
  moveToCart?: boolean
}

export function ProductCardContainer({
  product,
  quickAddLabel,
  showWishlist,
  showQuickAdd,
  compareMode,
  isCompared,
  onToggleCompare,
  moveToCart,
}: ProductCardContainerProps) {
  const card = useProductCard(product, { moveToCart })

  return (
    <ProductCard
      product={product}
      quickAddLabel={quickAddLabel}
      showWishlist={showWishlist}
      showQuickAdd={showQuickAdd}
      compareMode={compareMode}
      isCompared={isCompared}
      isWishlisted={card.isWishlisted}
      isAddingToCart={card.isAddingToCart}
      cartQuantity={card.cartQuantity}
      maxQuantity={card.maxQuantity}
      hasDiscount={card.hasDiscount}
      discountPercent={card.discountPercent}
      onPrefetch={card.prefetch}
      onToggleWishlist={card.toggleWishlist}
      onAddToCart={card.addToCart}
      onQuantityChange={card.setQuantity}
      onToggleCompare={onToggleCompare}
    />
  )
}
