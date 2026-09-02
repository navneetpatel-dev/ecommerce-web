import { LABELS } from "@/shared/constants/labels";
import type { CheckoutQuote } from "@/shared/api/types";

export function quoteOrderTotals(quote: CheckoutQuote) {
  return quote.orderTotals;
}

export function quoteTaxLabel(
  taxDisplayKey: CheckoutQuote['orderTotals']['taxDisplayKey'],
): string {
  if (taxDisplayKey === 'IGST') return LABELS.taxIgst;
  if (taxDisplayKey === 'CGST_SGST') return LABELS.taxCgstSgst;
  return LABELS.taxGst;
}
