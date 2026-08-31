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
