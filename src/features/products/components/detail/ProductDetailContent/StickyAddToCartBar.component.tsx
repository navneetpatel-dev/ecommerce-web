"use client";

import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";

interface StickyAddToCartBarProps {
  visible: boolean;
  productName: string;
  formattedPrice: string;
  addDisabled: boolean;
  addToCartHint: string;
  addLabel: string;
  isAddingToCart?: boolean;
  quantity: number;
  onAddToCart?: (quantity: number) => void;
}

export function StickyAddToCartBar({
  visible,
  productName,
  formattedPrice,
  addDisabled,
  addToCartHint,
  addLabel,
  isAddingToCart,
  quantity,
  onAddToCart,
}: StickyAddToCartBarProps) {
  if (!visible) return null;

  return (
    <div className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarRoot}>
      <div className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarRow}>
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarInfo}>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarTitle}>
            {productName}
          </p>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarPrice}>
            ₹{formattedPrice}
          </p>
        </div>
        <DisabledActionHint
          disabled={addDisabled}
          message={addToCartHint}
          className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarActionWrapper}
        >
          <Button
            size="lg"
            className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarButton}
            disabled={addDisabled}
            onClick={() => {
              if (addDisabled) return;
              onAddToCart?.(quantity);
            }}
            loading={isAddingToCart}
          >
            {addLabel}
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  );
}
