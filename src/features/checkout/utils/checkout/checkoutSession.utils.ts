import type { CartItem } from "@/shared/api/types";

/**
 * Checkout session identity (Rule 16: pure logic, no React).
 *
 * A checkout flow belongs to one basket: the chosen address, per-vendor shipping methods
 * and payment method mean nothing for a different one. Confirming an order empties the
 * basket, so the next purchase must start at step 1 — while editing the basket currently
 * being checked out (quantity, removing a line) must not throw those choices away.
 */

/** Identity of the basket a flow belongs to: its line ids, quantities ignored. */
export function checkoutCartSignature(
  items: Array<Pick<CartItem, "id">> | undefined,
): string {
  return (items ?? [])
    .map((item) => item.id)
    .sort()
    .join("|");
}

/**
 * True when the next basket shares no line with the one the flow was started for — a
 * different purchase rather than an edit of the current one. A basket that was emptied
 * (by the order that just went through, or by the customer) also starts the next flow fresh.
 */
export function isNewCheckoutSession(
  previousSignature: string | null,
  nextSignature: string,
): boolean {
  if (!previousSignature) return false;
  if (!nextSignature) return true;
  const previous = new Set(previousSignature.split("|"));
  return !nextSignature.split("|").some((id) => previous.has(id));
}

/**
 * The furthest step the current selections justify: 1 while no address is chosen, 2 while a
 * vendor has no shipping rate for that address, 3 without a usable payment method, else 4.
 * It stops at the first unresolved step so a selection wiped by a guard (address deleted in
 * another tab, COD gone out of range, wallet emptied) can't leave the customer parked on a
 * step the flow no longer supports. While the quote is still in flight it returns 4: there
 * is nothing to judge against yet, and yanking the customer back mid-load reads as a bug.
 */
export function resolveCheckoutStepCap(input: {
  addressChosen: boolean;
  quoteResolved: boolean;
  shippingReady: boolean;
  paymentValid: boolean;
}): 1 | 2 | 3 | 4 {
  if (!input.addressChosen) return 1;
  if (!input.quoteResolved) return 4;
  if (!input.shippingReady) return 2;
  if (!input.paymentValid) return 3;
  return 4;
}
