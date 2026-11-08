/** Mark-payout-paid dialog and reason prompts (finance payouts page). Subset of LABELS. */
export const payoutSettlementLabels = {
  reasonRequiredHint: "Enter a reason to continue.",
  markPayoutPaid: "Mark paid",
  markPaidFinanceDialogTitle: "Mark payout as paid",
  markPaidFinanceDialogBody:
    "Record the completed transfer. This action cannot be reversed here.",
  paymentMethodLabel: "Payment method",
  paymentReferenceLabel: "Payment reference number",
  paymentReferencePlaceholder: "UTR, transaction ID, or cheque number",
  referenceRequiredHint: "Enter a payment reference number.",
  paidAtLabel: "Paid at (optional)",
  proofOfPaymentLabel: "Proof of payment (optional)",
  proofFileHint: "PNG, JPEG, WebP, or PDF • Max 5 MB",
  remarksLabel: "Remarks (optional)",
  couldNotMarkPayoutPaid: "Could not mark this payout as paid.",
} as const;
