import type { CartItem } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { UNAVAILABLE_REASON } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import {
  hasPendingCartLineSubtotal,
  resolveCartLineDisplaySubtotal,
} from "@/features/cart/utils/line-item/cartDisplay.utils";
import {
  eachPriceCopy,
  unavailableLabel,
  variantLabel,
} from "../../components/line-item/CartLineItem/cartLineShared.component";

interface UseCartLineViewModelParams {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function useCartLineViewModel({
  item,
  onUpdateQuantity,
}: UseCartLineViewModelParams) {
  const available = item.isAvailable !== false;
  const linePending = hasPendingCartLineSubtotal(item);
  const lineTotal = resolveCartLineDisplaySubtotal(item);
  const attrs = variantLabel(item);
  const eachPrice = eachPriceCopy(item);
  // B-66: stock fell below the line's quantity, but some is left to buy.
  const lowStockMax =
    item.unavailableReason === UNAVAILABLE_REASON.LOW_STOCK
      ? (item.maxQuantity ?? 0)
      : 0;
  const unavailableReasonText = unavailableLabel(
    item.unavailableReason,
    lowStockMax,
  );
  const setToAvailableLabel =
    lowStockMax > 0
      ? formatLabel(LABELS.cartSetQuantityTo, { count: lowStockMax })
      : null;
  const change = item.priceChange;
  const priceChangeText = change
    ? formatLabel(
        change.direction === "DOWN"
          ? LABELS.cartPriceDropped
          : LABELS.cartPriceRose,
        { price: formatInr(change.previousDisplayPrice) },
      )
    : null;

  const handleQuantityChange = (quantity: number) => {
    onUpdateQuantity(item.id, quantity);
  };
  const handleSetToAvailable = () => {
    onUpdateQuantity(item.id, lowStockMax);
  };

  return {
    available,
    linePending,
    lineTotal,
    attrs,
    eachPrice,
    unavailableReasonText,
    priceChangeText,
    priceChangeDirection: change?.direction ?? null,
    setToAvailableLabel,
    handleQuantityChange,
    handleSetToAvailable,
  };
}
