"use client";

import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { MoneyAmount } from "@/shared/components/display/MoneyAmount.component";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";

interface StickyAddToCartBarProps {
  visible: boolean;
  productName: string;
  displayPrice: number;
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
  displayPrice,
  addDisabled,
  addToCartHint,
  addLabel,
  isAddingToCart,
  quantity,
  onAddToCart,
}: StickyAddToCartBarProps) {
  const handleAddToCartClick = () => {
    if (addDisabled) return;
    onAddToCart?.(quantity);
  };

  if (!visible) return null;

  return (
    <div className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarRoot}>
      <div className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarRow}>
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarInfo}>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarTitle}>
            {productName}
          </p>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.stickyBarPrice}>
            <MoneyAmount value={displayPrice} />
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
            onClick={handleAddToCartClick}
            loading={isAddingToCart}
          >
            {addLabel}
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  );
}
