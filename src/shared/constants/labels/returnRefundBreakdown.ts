/**
 * Line-item refund breakdown copy for the customer-facing return card.
 * NOT yet merged into the root `labels.ts` — see "SHARED FILE CHANGES
 * NEEDED" in the task report; import directly from this module until then.
 */
export const returnRefundBreakdownLabels = {
  returnRefundBreakdownItem: "Merchandise refund",
  returnRefundBreakdownTax: "Tax refunded",
  returnRefundBreakdownShipping: "Shipping refunded",
  returnRefundBreakdownFee: "Return shipping fee",
  returnRefundBreakdownWallet: "To wallet",
  returnRefundBreakdownBank: "To bank / UPI",
  /** Caption above the wallet/bank split — makes clear it's a payment-method breakdown of the
   * same total above, not additional line items. */
  returnRefundBreakdownMethodCaption: "Refunded via",
} as const;
