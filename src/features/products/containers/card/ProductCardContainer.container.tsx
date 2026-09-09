"use client";

import { useState } from "react";
import { useProductCard } from "../../hooks/card/useProductCard.hook";
import { ProductCard } from "../../components/card/ProductCard.component";
import { ProductVariantDialog } from "../../components/variants/ProductVariantDialog.component";
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
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const card = useProductCard(product);
  const requiresVariantSelection = (product.variants?.length ?? 0) > 1;

  const handleAddToCart = () => {
    if (card.cartQuantity === 0 && requiresVariantSelection) {
      setVariantDialogOpen(true);
      return;
    }
    card.addToCart();
  };

  return (
    <>
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
        onAddToCart={handleAddToCart}
        onQuantityChange={card.setQuantity}
        onToggleCompare={onToggleCompare}
      />

      {requiresVariantSelection ? (
        <ProductVariantDialog
          open={variantDialogOpen}
          productName={product.name}
          productSlug={product.slug || product.id}
          isAddingToCart={card.isAddingToCart}
          onOpenChange={setVariantDialogOpen}
          onConfirm={(variantId) => {
            card.addToCart(variantId);
            setVariantDialogOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
