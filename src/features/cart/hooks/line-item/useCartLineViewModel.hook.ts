import type { CartItem } from "@/shared/api/types";
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
    handleQuantityChange,
  };
}
