import type { CheckoutQuote } from "@/shared/api/types";

export function quoteOrderTotals(quote: CheckoutQuote) {
  return quote.orderTotals;
}
