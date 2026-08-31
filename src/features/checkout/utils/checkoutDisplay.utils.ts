import type { CartItem, CheckoutQuote } from "@/shared/api/types";

export function resolveCartLineSubtotal(
  item: CartItem,
  quote?: CheckoutQuote | null,
): number {
  if (quote) {
    for (const vendor of quote.vendorBreakdowns) {
      const line = vendor.items.find((entry) => entry.id === item.id);
      if (line) return line.lineSubtotal;
    }
  }
  return item.lineSubtotal ?? 0;
}
