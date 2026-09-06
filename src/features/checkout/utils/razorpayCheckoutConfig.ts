/** Explicitly enable Standard Checkout payment method tabs (does not bypass dashboard/KYC). */
export function getRazorpayCheckoutMethods() {
  return {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
    emi: true,
    // Razorpay-native EMI only, no third-party BNPL — no PayLater partner contract exists.
    paylater: false,
  };
}

/**
 * Prefer Razorpay defaults — only ask Checkout to keep its built-in blocks.
 * Avoid custom `sequence` here; misconfigured sequences can hide methods.
 */
export function getRazorpayCheckoutConfig() {
  return {
    display: {
      preferences: {
        show_default_blocks: true,
      },
    },
  };
}
