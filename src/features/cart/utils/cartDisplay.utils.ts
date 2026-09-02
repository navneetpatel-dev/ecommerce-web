import type { Cart, CartItem } from "@/shared/api/types";

export function hasPendingCartLineSubtotal(item: CartItem): boolean {
  return item.lineSubtotal == null;
}

export function cartHasPendingLineSubtotals(cart: Cart | undefined): boolean {
  return cart?.items?.some(hasPendingCartLineSubtotal) ?? false;
}

/** Server-provided line subtotal only — no client-side pricing. */
export function resolveCartLineDisplaySubtotal(item: CartItem): number | undefined {
  return item.lineSubtotal;
}

/** Clears aggregate totals while waiting for the server after an optimistic qty patch. */
function clearCartAggregateTotals(cart: Cart): Cart {
  return {
    ...cart,
    merchandiseSubtotal: undefined,
    total: undefined,
    pricingPreview: undefined,
  };
}

/** Optimistically update qty; line/aggregate amounts come back from the API. */
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

  return clearCartAggregateTotals({
    ...cart,
    items: cart.items.map((item) =>
      item.id === itemId
        ? { ...item, quantity, lineSubtotal: undefined }
        : item,
    ),
  });
}

export function patchRemoveCartItem(cart: Cart, itemId: string): Cart {
  return clearCartAggregateTotals({
    ...cart,
    items: cart.items.filter((item) => item.id !== itemId),
  });
}

/** Read server-computed cart totals only. */
export function resolveCartDisplayTotals(cart: Cart | undefined) {
  const items = cart?.items ?? [];
  const pendingLineTotals = cartHasPendingLineSubtotals(cart);
  const preview =
    !pendingLineTotals && cart?.pricingPreview ? cart.pricingPreview : undefined;

  return {
    pendingLineTotals,
    subtotal: cart?.merchandiseSubtotal,
    subtotalPending: cart?.merchandiseSubtotal == null && items.length > 0,
    total: cart?.total ?? preview?.grandTotal,
    totalIsEstimated: pendingLineTotals || cart?.total == null,
    pricingPreview: preview,
  };
}
