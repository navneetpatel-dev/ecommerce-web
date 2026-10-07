/**
 * Delivery-agent operations copy: the agent shift/deposit flow and the admin
 * panel actions/dialogs that consume it (reason prompts, payout settlement).
 * Subset of LABELS; merged in labels/index.ts.
 */
export const deliveryAgentOpsLabels = {
  // Agent shift card + cash deposit dialog
  shiftCardTitle: "Today's shift",
  depositCash: "Deposit cash",
  deliveredTodayCaption: "Delivered",
  pickupsTodayCaption: "Pickups",
  onTimeCaption: "On-time",
  earningsPerTaskCaption: "Earnings ({rate}/task)",
  codCashInHandCaption: "COD cash in hand",
  pendingDepositOne: "{count} cash deposit awaiting hub verification.",
  pendingDepositMany: "{count} cash deposits awaiting hub verification.",
  depositDialogTitle: "Deposit COD cash",
  depositDialogHint:
    "Declare the cash you're handing to the hub. The system expects {amount} based on collected COD orders.",
  depositAmountLabel: "Amount deposited",
  depositNoteLabel: "Note (optional)",
  submitDeposit: "Submit deposit",
  depositFailedFallback: "Could not submit cash deposit.",

  // Admin reconciliation/review/settlement panels
  cashDepositsPanelTitle: "COD cash deposits reconciliation",
  cashDepositsPendingBadge: "{count} pending verification",
  noCashDepositsEmpty: "No cash deposits submitted yet.",
  agentDocsPanelTitle: "Agent verification documents (KYC)",
  agentDocsPendingBadge: "{count} pending review",
  noDocumentsEmpty: "No documents submitted yet.",
  viewDocument: "View document",
  agentPayoutsPanelTitle: "Agent payouts management",
  agentPayoutsPendingBadge: "{count} pending",
  noPayoutsEmpty: "No agent payouts yet.",
  processSettledEarnings: "Process settled earnings",
  pdfShortLabel: "PDF",
  markPayoutFailed: "Mark failed",
  markPayoutPaid: "Mark paid",
  retryPayout: "Retry",
  payoutBatchesCreated:
    "{count} payout batch(es) created from settled earnings.",
  noPendingEarnings: "No pending earnings to process.",
  couldNotProcessPayouts: "Could not process agent payouts.",
  couldNotMarkPayoutFailed: "Could not mark this payout failed.",
  couldNotRetryPayout: "Could not retry this payout.",
  couldNotUpdateDeposit: "Could not update this deposit.",
  couldNotUpdateDocument: "Could not update this document.",

  // Reason prompts (destructive admin actions)
  rejectDepositTitle: "Reject this cash deposit?",
  rejectDepositBody:
    "The agent sees your reason. The declared amount stays recorded for reconciliation.",
  rejectDepositPlaceholder: "Why is this deposit being rejected?",
  rejectDocumentTitle: "Reject this document?",
  rejectDocumentBody:
    "The agent will be asked to upload a replacement. Explain what's wrong with this document.",
  rejectDocumentPlaceholder: "Why is this document being rejected?",
  failPayoutTitle: "Mark this payout as failed?",
  failPayoutBody:
    "Describe why the transfer failed. The payout can be retried afterwards.",
  failPayoutPlaceholder: "Why did this payout fail?",
  reasonRequiredHint: "Enter a reason to continue.",

  // Mark-payout-paid dialogs (agent payouts panel + finance payouts page)
  markPaidAgentDialogTitle: "Mark agent payout as paid",
  markPaidAgentDialogBody:
    "Record the transfer to the delivery agent's account. This action cannot be reversed here.",
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
  couldNotMarkAgentPayoutPaid: "Could not mark this agent payout as paid.",
  couldNotMarkPayoutPaid: "Could not mark this payout as paid.",

  // Agent bank details form
  bankAccountHolder: "Account holder name",
  bankAccountNumber: "Account number",
  bankIfscLabel: "IFSC code",
  bankIfscPlaceholder: "SBIN0001234",
  bankUpiLabel: "UPI ID (optional)",
  bankUpiPlaceholder: "name@bank",
  agentPanPlaceholder: "ABCDE1234F",

  // Agent document rows
  docUpload: "Upload",
  docUploading: "Uploading...",
  docReupload: "Re-upload",
  docExpiryPlaceholder: "Expiry date (optional)",
  docExpiryAriaLabel: "{label} expiry date",

  // Barcode scanner
  scanBarcode: "Scan barcode",
  scanDialogTitle: "Scan package barcode",
  cameraPreviewAria: "Camera preview",
  scannerUnsupported:
    "This browser can't scan barcodes. Type the tracking number instead.",
  scannerCameraError: "Camera unavailable. Check permissions and try again.",

  // Failed-attempt / issue reporting
  exceptionBadge: "Exception",
  reportDeliveryIssueTitle: "Report Delivery Issue",
  reportDeliveryIssueBody:
    "If the customer is unavailable, the address cannot be reached, or this task cannot be completed, record the reason below:",
  reportPickupIssueTitle: "Report Pickup Issue",
  reportPickupIssueBody:
    "If the customer is unavailable, the item is damaged or missing, or the pickup cannot proceed, record the reason below:",
  failureReasonPlaceholder: "Required reason for failed attempt (min 3 chars)",
  pickupFailurePlaceholder:
    "Required reason for failed pickup attempt (min 3 chars)",
  failureReasonMinHint: "Enter at least 3 characters to continue.",
  markAttemptFailed: "Mark attempt failed",
  recordFailedAttempt: "Record failed attempt",
  addEvidencePhoto: "Add evidence photo (optional)",
} as const;
