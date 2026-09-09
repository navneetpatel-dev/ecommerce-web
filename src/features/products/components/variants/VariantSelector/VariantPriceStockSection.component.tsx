import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { variantSelectorStyles } from "./variantSelector.styles";

interface VariantPriceStockSectionProps {
  currentPrice: number;
  currentStock: number;
  basePrice: number;
  hasPriceChange: boolean;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
  canAddToCart?: boolean;
  lowStockAt: number;
  freeShippingThreshold?: number;
}

export function VariantPriceStockSection({
  currentPrice,
  currentStock,
  basePrice,
  hasPriceChange,
  showAddToCart,
  onAddToCart,
  isAddingToCart,
  canAddToCart = true,
  lowStockAt,
  freeShippingThreshold,
}: VariantPriceStockSectionProps) {
  const isOutOfStock = currentStock === 0;
  const isAddToCartDisabled = isOutOfStock || !canAddToCart;

  const disabledMessage = isOutOfStock
    ? LABELS.outOfStockHint
    : !canAddToCart
      ? LABELS.selectAllOptionsHint
      : "";

  return (
    <>
      <Separator />

      <div className={variantSelectorStyles.priceWrapper}>
        <span className={variantSelectorStyles.currentPrice}>
          ₹{formatInrAmount(currentPrice)}
        </span>
        {hasPriceChange ? (
          <span className={variantSelectorStyles.basePrice}>
            ₹{formatInrAmount(basePrice)}
          </span>
        ) : null}
      </div>

      <div className={variantSelectorStyles.stockWrapper}>
        <div className={variantSelectorStyles.badgesRow}>
          {isOutOfStock ? (
            <Badge variant="destructive">{LABELS.outOfStock}</Badge>
          ) : currentStock <= lowStockAt ? (
            <Badge variant="destructive">
              {formatLabel(LABELS.onlyLeft, { count: currentStock })}
            </Badge>
          ) : (
            <Badge variant="success">{LABELS.inStock}</Badge>
          )}
          {typeof freeShippingThreshold === "number" ? (
            <p className={variantSelectorStyles.freeShippingText}>
              {formatLabel(LABELS.freeDeliveryAbove, {
                amount: formatInrAmount(freeShippingThreshold),
              })}
            </p>
          ) : null}
        </div>

        {showAddToCart ? (
          <DisabledActionHint
            disabled={isAddToCartDisabled}
            message={disabledMessage}
            className={variantSelectorStyles.addToCartButton}
          >
            <Button
              size="lg"
              className={variantSelectorStyles.addToCartButton}
              disabled={isAddToCartDisabled}
              onClick={onAddToCart}
              loading={isAddingToCart}
            >
              {LABELS.addToCart}
            </Button>
          </DisabledActionHint>
        ) : null}
      </div>
    </>
  );
}
