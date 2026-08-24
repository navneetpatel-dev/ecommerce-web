"use client";

import { useCallback, useState } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { LABELS } from "@/shared/constants/labels";
import { resolveProductStock } from "../../utils/productListItem";
import { CardControls } from "./CardControls.component";
import { CardDetails } from "./CardDetails.component";
import { CardMedia } from "./CardMedia.component";
import type { ProductCardProps } from "./types";

export function ProductCard({
  product,
  quickAddLabel = LABELS.quickAdd,
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
  const [imageUnavailable, setImageUnavailable] = useState(!product.imageUrl);
  const handleUnavailableChange = useCallback((unavailable: boolean) => {
    setImageUnavailable(unavailable);
  }, []);

  const inCart = cartQuantity > 0;
  const canQuickAdd =
    showQuickAdd &&
    Boolean(product.variants?.[0]?.id) &&
    resolveProductStock(product) > 0;

  return (
    <div className="group relative">
      <CardMedia
        product={product}
        imageUnavailable={imageUnavailable}
        onUnavailableChange={handleUnavailableChange}
        showWishlist={showWishlist}
        isWishlisted={isWishlisted}
        canQuickAdd={canQuickAdd}
        inCart={inCart}
        isAddingToCart={isAddingToCart}
        cartQuantity={cartQuantity}
        maxQuantity={maxQuantity}
        quickAddLabel={quickAddLabel}
        onPrefetch={onPrefetch}
        onToggleWishlist={onToggleWishlist}
        onAddToCart={onAddToCart}
        onQuantityChange={onQuantityChange}
      />

      <CardDetails
        product={product}
        hasDiscount={hasDiscount}
        discountPercent={discountPercent}
      />

      {canQuickAdd && (
        <div className="mt-2 md:hidden">
          <CardControls
            variant="mobile"
            inCart={inCart}
            isAddingToCart={isAddingToCart}
            cartQuantity={cartQuantity}
            maxQuantity={maxQuantity}
            quickAddLabel={quickAddLabel}
            onAddToCart={onAddToCart}
            onQuantityChange={onQuantityChange}
          />
        </div>
      )}

      {compareMode && (
        <label className="mt-2 flex items-center gap-2 text-body-sm text-ink-muted">
          <Checkbox
            checked={isCompared}
            onCheckedChange={() => onToggleCompare?.(product)}
            aria-label={`Compare ${product.name}`}
          />
          Compare
        </label>
      )}
    </div>
  );
}
