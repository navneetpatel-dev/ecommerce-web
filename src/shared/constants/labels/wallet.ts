/** Wallet, payment split, cashback and checkout payment methods copy. Subset of LABELS; merged in labels/index.ts. */
export const walletLabels = {
  wallet: "Wallet Points",
  walletBalance: "Points balance",
  walletAmountToApply: "Points to apply",
  walletUseAll: "Use full balance",
  walletRemainderDue: "Amount due today: {amount}",
  walletFullyCoversOrder:
    "Your points cover this order — no online payment needed.",
  walletNotAvailableWithCod:
    "Points cannot be used with cash on delivery.",
  walletPageDescription:
    "Recharge store points or use credits from returns and cashback at checkout.",
  walletTransactionHistory: "Transaction history",
  walletNoTransactions: "No wallet activity yet.",
  walletCredit: "Credit",
  walletDebit: "Debit",
  walletTransactionSourceCodRefund: "COD return refund",
  walletTransactionSourceWalletRefund: "Wallet refund",
  walletTransactionSourceCashback: "Cashback",
  walletTransactionSourceCheckout: "Checkout payment",
  walletTransactionSourceClawback: "Cashback recovery",
  walletTransactionSourceTopup: "Points recharge",
  walletTransactionSourceOther: "Adjustment",
  walletBalanceAfter: "Balance after {amount}",
  walletApplyPoints: "Apply points",
  walletPointsEqualsInr: "1 point = ₹1 off at checkout",
  walletRecharge: "Recharge points",
  walletRechargePresets: "Quick amounts",
  walletRechargeCustomAmount: "Custom amount",
  walletRechargeLimitsHint: "Between {min} and {max} per recharge",
  walletRechargePreview: "You will receive {points}",
  walletRechargePay: "Pay & add points",
  walletRechargeBelowMin: "Amount is below the minimum recharge",
  walletRechargeAboveMax: "Amount exceeds the maximum per recharge",
  walletMaxBalanceReached: "This recharge would exceed your maximum points balance",
  walletRechargeSuccess: "Points added to your wallet",
  walletTermsNotice:
    "Store points are non-transferable store credit. They cannot be withdrawn as cash.",

  // Payment split & cashback
  paymentSplitHeading: "Payment",
  paymentSplitWallet: "{amount} from points",
  paymentSplitRazorpay: "{amount} via Razorpay",
  paymentSplitCod: "Cash on delivery",
  cashbackPendingAfterDelivery:
    "Cashback pending — credited as points after delivery",
  cashbackCreditedToWallet: "{amount} cashback credited as points",
  cashbackPayNowMessage: "Pay {payNow} now, {cashback} cashback after delivery",
  couponCashbackApplied: "Cashback offer: {code}",

  // Checkout payment methods
  paymentMethodRazorpay: "Card / UPI / Netbanking",
  paymentMethodRazorpayDesc: "Pay securely via Razorpay",
  paymentMethodCod: "Cash on Delivery",
  paymentMethodCodDesc: "Pay when your order arrives",
  selectPaymentMethodToContinue: "Select a payment method to continue.",
  backToShipping: "Back to shipping",
  continueToReview: "Continue to review",
  walletAppliedAtCheckout: "Points applied",
  amountDueToday: "Due today",

  // Return timelines
} as const;
