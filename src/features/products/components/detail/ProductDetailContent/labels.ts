import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

export function getQuantityDisabledHint({
  needsOptionSelection,
  variantUnavailable,
  canAddToCart,
}: {
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  canAddToCart: boolean;
}): string {
  return needsOptionSelection
    ? LABELS.selectAllOptionsHint
    : variantUnavailable
      ? LABELS.variantUnavailableHint
      : !canAddToCart
        ? LABELS.outOfStockHint
        : LABELS.deliveryNotServiceable;
}

export function getAddToCartLabel({
  needsOptionSelection,
  variantUnavailable,
  displayStock,
}: {
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  displayStock: number;
}): string {
  return needsOptionSelection
    ? LABELS.selectOptions
    : variantUnavailable
      ? LABELS.notAvailable
      : displayStock === 0
        ? LABELS.outOfStock
        : LABELS.addToCart;
}

export function getStickyAddLabel(
  needsOptionSelection: boolean,
  variantUnavailable: boolean,
  formattedPrice: string,
): string {
  return needsOptionSelection
    ? LABELS.selectOptions
    : variantUnavailable
      ? LABELS.notAvailable
      : formatLabel(LABELS.addToCartWithPrice, { price: formattedPrice });
}

export function getAddToCartHint({
  needsOptionSelection,
  variantUnavailable,
  displayStock,
  deliveryBlocked,
  isAddingToCart,
}: {
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  displayStock: number;
  deliveryBlocked: boolean;
  isAddingToCart?: boolean;
}): string {
  return needsOptionSelection
    ? LABELS.selectOptionsHint
    : variantUnavailable
      ? LABELS.variantUnavailableHint
      : displayStock === 0
        ? LABELS.outOfStockHint
        : deliveryBlocked
          ? LABELS.deliveryNotServiceable
          : isAddingToCart
            ? LABELS.addingToCart
            : "";
}
