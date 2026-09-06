/**
 * Line-item refund breakdown copy for the customer-facing return card.
 * NOT yet merged into the root `labels.ts` — see "SHARED FILE CHANGES
 * NEEDED" in the task report; import directly from this module until then.
 */
export const returnRefundBreakdownLabels = {
  returnRefundBreakdownItem: "Item refund",
  returnRefundBreakdownTax: "Tax refunded",
  returnRefundBreakdownShipping: "Shipping refunded",
  returnRefundBreakdownWallet: "To wallet",
  returnRefundBreakdownBank: "To bank / UPI",
} as const;
