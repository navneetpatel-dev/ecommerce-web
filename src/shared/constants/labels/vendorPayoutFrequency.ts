/** Vendor payout-cadence preference copy; merged via labels.ts. */
export const vendorPayoutFrequencyLabels = {
  payoutFrequency: "Preferred payout frequency",
  payoutFrequencyHint:
    "Pay me no more often than this. A payout run only settles deliveries before the end of your chosen cycle (or the platform cycle, whichever is longer).",
  payoutFrequencyNoPreference: "No preference",
  payoutFrequencyWeekly: "Weekly",
  payoutFrequencyBiweekly: "Every two weeks",
  payoutFrequencyMonthly: "Monthly",
} as const;
