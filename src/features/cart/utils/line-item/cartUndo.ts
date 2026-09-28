import type { Cart, CartItem } from "@/shared/api/types";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/** The line being removed, read from the cache the removal mutation patches. */
export function findCachedCartItem(
  caches: Array<[unknown, Cart | undefined]>,
  itemId: string,
): CartItem | undefined {
  for (const [, cart] of caches) {
    const match = cart?.items.find((item) => item.id === itemId);
    if (match) return match;
  }
  return undefined;
}

/**
 * A mis-tapped "remove" is the common case, so the toast carries the one-tap
 * way back: re-adding the same variant and quantity, without reopening the
 * drawer the customer just closed.
 */
export function offerRemovedItemUndo(
  item: CartItem,
  reAdd: (variantId: string, quantity: number) => void,
): void {
  notifySuccess(
    formatLabel(LABELS.cartItemRemoved, { name: item.product.name }),
    {
      label: LABELS.undo,
      onClick: () => reAdd(item.variantId, item.quantity),
    },
  );
}
