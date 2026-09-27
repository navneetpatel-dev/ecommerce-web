import type { CartItem, CheckoutQuote } from "@/shared/api/types";

/** Line total as the customer sees it (GST included), from the checkout quote or cart API — no client-side pricing. */
export function resolveCartLineSubtotal(
  item: CartItem,
  quote?: CheckoutQuote | null,
): number | undefined {
  if (quote) {
    for (const vendor of quote.vendorBreakdowns) {
      const line = vendor.items.find((entry) => entry.id === item.id);
      if (line) return line.lineDisplaySubtotal ?? line.lineSubtotal;
    }
  }
  return item.lineSubtotal == null
    ? undefined
    : (item.lineDisplaySubtotal ?? item.lineSubtotal);
}
