import { Button } from "@/shared/components/ui/button";
import { QuantitySelector } from "@/shared/components/QuantitySelector/QuantitySelector.component";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";

interface PurchaseActionsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  quantityMax: number;
  quantityDisabled: boolean;
  quantityDisabledHint: string;
  addDisabled: boolean;
  addToCartHint: string;
  addToCartLabel: string;
  isAddingToCart?: boolean;
  onAddToCart: () => void;
}

/** Quantity and Add to cart; left out entirely when the chosen variant is sold out. */
export function PurchaseActions({
  quantity,
  onQuantityChange,
  quantityMax,
  quantityDisabled,
  quantityDisabledHint,
  addDisabled,
  addToCartHint,
  addToCartLabel,
  isAddingToCart,
  onAddToCart,
}: PurchaseActionsProps) {
  return (
    <>
      <QuantitySelector
        value={quantity}
        onChange={onQuantityChange}
        max={quantityMax}
        disabled={quantityDisabled}
        disabledHint={quantityDisabledHint}
        className={PRODUCT_DETAIL_CONTENT_STYLES.quantitySelector}
        controlClassName={PRODUCT_DETAIL_CONTENT_STYLES.quantityControl}
        valueClassName={PRODUCT_DETAIL_CONTENT_STYLES.quantityValue}
      />

      <DisabledActionHint
        disabled={addDisabled}
        message={addToCartHint}
        className={PRODUCT_DETAIL_CONTENT_STYLES.addToCartWrapper}
      >
        <Button
          className={PRODUCT_DETAIL_CONTENT_STYLES.addToCartButton}
          disabled={addDisabled}
          onClick={onAddToCart}
          loading={isAddingToCart}
        >
          {addToCartLabel}
        </Button>
      </DisabledActionHint>
    </>
  );
}
