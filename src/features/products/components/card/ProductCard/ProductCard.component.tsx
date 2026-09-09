"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { CardControls } from "./CardControls.component";
import { CardDetails } from "./CardDetails.component";
import { CardMedia } from "./CardMedia.component";
import { useProductCard } from "../../../hooks/card/useProductCardPresentation.hook";
import { PRODUCT_CARD_STYLES } from "../../../styles/card/productCard.styles";
import type { ProductCardProps } from "../../../types/card/types";

export function ProductCard({
  product,
  quickAddLabel = LABELS.quickAdd,
  showWishlist = true,
  showQuickAdd = true,
  compareMode = false,
  isCompared = false,
  compareAtLimit = false,
  isWishlisted = false,
  isAddingToCart = false,
  cartQuantity = 0,
  maxQuantity = 99,
  showMrp = false,
  discountPercent = 0,
  onPrefetch,
  onToggleWishlist,
  onAddToCart,
  onQuantityChange,
  onToggleCompare,
}: ProductCardProps) {
  const {
    imageUnavailable,
    handleUnavailableChange,
    inCart,
    canQuickAdd,
    handleCompareCheckedChange,
    compareMaxHint,
  } = useProductCard({
    product,
    showQuickAdd,
    cartQuantity,
    compareAtLimit,
    isCompared,
    onToggleCompare,
  });

  return (
    <div className={PRODUCT_CARD_STYLES.root}>
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
        showMrp={showMrp}
        discountPercent={discountPercent}
      />

      {canQuickAdd && (
        <div className={PRODUCT_CARD_STYLES.mobileControlsWrapper}>
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
        <DisabledActionHint
          disabled={compareAtLimit && !isCompared}
          message={compareMaxHint}
          className={PRODUCT_CARD_STYLES.compareHint}
          block
        >
          <label className={PRODUCT_CARD_STYLES.compareLabel}>
            <Checkbox
              checked={isCompared}
              disabled={compareAtLimit && !isCompared}
              onCheckedChange={handleCompareCheckedChange}
              aria-label={`Compare ${product.name}`}
            />
            {LABELS.compare}
          </label>
        </DisabledActionHint>
      )}
    </div>
  );
}
