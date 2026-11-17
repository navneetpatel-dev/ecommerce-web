/** Copy added for the Platform Settings and vendor bank forms. */
export const platformSettingsLabels = {
  bankAccountNumberInvalid: "Account number must be 9 to 18 digits",
  bankAccountNumbersMismatch: "Account numbers do not match",
  bankIfscInvalid: "Enter a valid 11-character IFSC code (e.g. HDFC0001234)",
  autoApproveProductsHint:
    "On: a vendor's submitted product goes live immediately. Off: it waits in the moderation queue.",
  autoApproveReviews: "Auto-approve reviews",
  autoApproveReviewsHint:
    "On: clean reviews publish immediately. Off: every review waits for moderation.",
  autoApproveQuestions: "Auto-approve questions",
  autoApproveQuestionsHint:
    "On: clean product questions publish immediately. Off: every question waits for moderation.",
  freeShippingThresholdHint:
    "Used for shipping rates that have no free-shipping threshold of their own.",
  payoutCycleDaily: "Daily",
  payoutCycleHint:
    "A payout run settles only sales delivered before the latest cycle boundary (UTC; weeks start Monday).",
  savingSettings: "Saving…",
} as const;
