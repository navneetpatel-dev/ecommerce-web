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
  /** Taken off because the items kept no longer qualify for the order's offer. */
  returnRefundBreakdownOffer: "Offer no longer applies",
  returnRefundBreakdownWallet: "To wallet",
  returnRefundBreakdownBank: "To bank / UPI",
  /** Caption above the wallet/bank split — makes clear it's a payment-method breakdown of the
   * same total above, not additional line items. */
  returnRefundBreakdownMethodCaption: "Refunded via",
} as const;
