import type { CartItem } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
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
  const unavailableReasonText = unavailableLabel(item.unavailableReason);
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

  return {
    available,
    linePending,
    lineTotal,
    attrs,
    eachPrice,
    unavailableReasonText,
    priceChangeText,
    priceChangeDirection: change?.direction ?? null,
    handleQuantityChange,
  };
}
