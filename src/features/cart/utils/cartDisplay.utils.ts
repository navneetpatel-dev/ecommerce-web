import type { Cart, CartItem } from "@/shared/api/types";

/** Scale a server-provided line subtotal when qty changes optimistically. */
export function scaleCartLineSubtotal(
  lineSubtotal: number | undefined,
  fromQty: number,
  toQty: number,
): number | undefined {
  if (lineSubtotal == null || fromQty <= 0 || toQty <= 0) return undefined;
  if (fromQty === toQty) return lineSubtotal;
  return Math.round((lineSubtotal / fromQty) * toQty * 100) / 100;
}

export function hasPendingCartLineSubtotal(item: CartItem): boolean {
  return item.lineSubtotal == null;
}

export function cartHasPendingLineSubtotals(cart: Cart | undefined): boolean {
  return cart?.items?.some(hasPendingCartLineSubtotal) ?? false;
}

export function resolveCartLineDisplaySubtotal(item: CartItem): number | undefined {
  return item.lineSubtotal;
}

/** Clears aggregate totals while line-level amounts catch up after an optimistic patch. */
function clearCartAggregateTotals(cart: Cart): Cart {
  return {
    ...cart,
    merchandiseSubtotal: undefined,
    total: undefined,
    pricingPreview: undefined,
  };
}

/** Optimistically update one cart line's qty (scales server lineSubtotal when possible). */
export function patchExistingCartItemQuantity(
  cart: Cart,
  itemId: string,
  quantity: number,
): Cart {
  const existing = cart.items.find((item) => item.id === itemId);
  if (!existing) return cart;

  if (quantity <= 0) {
    return patchRemoveCartItem(cart, itemId);
  }

  const nextLineSubtotal = scaleCartLineSubtotal(
    existing.lineSubtotal,
    existing.quantity,
    quantity,
  );

  return clearCartAggregateTotals({
    ...cart,
    items: cart.items.map((item) =>
      item.id === itemId
        ? { ...item, quantity, lineSubtotal: nextLineSubtotal }
        : item,
    ),
  });
}

/** Optimistically remove a cart line and clear stale aggregate totals. */
export function patchRemoveCartItem(cart: Cart, itemId: string): Cart {
  return clearCartAggregateTotals({
    ...cart,
    items: cart.items.filter((item) => item.id !== itemId),
  });
}

export function resolveCartDisplayTotals(cart: Cart | undefined) {
  const pendingLineTotals = cartHasPendingLineSubtotals(cart);
  const grandTotal =
    !pendingLineTotals && cart
      ? (cart.total ?? cart.pricingPreview?.grandTotal)
      : undefined;

  return {
    pendingLineTotals,
    subtotal: cart?.merchandiseSubtotal,
    subtotalPending:
      cart?.merchandiseSubtotal == null && (cart?.items?.length ?? 0) > 0,
    total: grandTotal ?? cart?.merchandiseSubtotal ?? 0,
    totalIsEstimated: grandTotal == null,
  };
}
