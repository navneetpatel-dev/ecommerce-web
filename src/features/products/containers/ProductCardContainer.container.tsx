"use client";

import { useProductCard } from "../hooks/useProductCard.hook";
import { ProductCard } from "../components/ProductCard.component";
import type { ProductListItem } from "@/shared/api/types";

interface ProductCardContainerProps {
  product: ProductListItem;
  quickAddLabel?: string;
  showWishlist?: boolean;
  showQuickAdd?: boolean;
  compareMode?: boolean;
  isCompared?: boolean;
  compareAtLimit?: boolean;
  onToggleCompare?: (product: ProductListItem) => void;
}

export function ProductCardContainer({
  product,
  quickAddLabel,
  showWishlist,
  showQuickAdd,
  compareMode,
  isCompared,
  compareAtLimit,
  onToggleCompare,
}: ProductCardContainerProps) {
  const card = useProductCard(product);

  return (
    <ProductCard
      product={product}
      quickAddLabel={quickAddLabel}
      showWishlist={showWishlist}
      showQuickAdd={showQuickAdd}
      compareMode={compareMode}
      isCompared={isCompared}
      compareAtLimit={compareAtLimit}
      isWishlisted={card.isWishlisted}
      isAddingToCart={card.isAddingToCart}
      cartQuantity={card.cartQuantity}
      maxQuantity={card.maxQuantity}
      showMrp={card.showMrp}
      discountPercent={card.discountPercent}
      onPrefetch={card.prefetch}
      onToggleWishlist={card.toggleWishlist}
      onAddToCart={card.addToCart}
      onQuantityChange={card.setQuantity}
      onToggleCompare={onToggleCompare}
    />
  );
}
