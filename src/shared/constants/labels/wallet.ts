/** Wallet, payment split, cashback and checkout payment methods copy. Subset of LABELS; merged in labels/index.ts. */
export const walletLabels = {
  wallet: "Wallet",
  walletBalance: "Wallet balance",
  walletAmountToApply: "Amount to apply from wallet",
  walletUseAll: "Use full balance",
  walletRemainderDue: "Amount due today: {amount}",
  walletFullyCoversOrder:
    "Your wallet covers this order — no online payment needed.",
  walletNotAvailableWithCod:
    "Wallet balance cannot be used with cash on delivery.",
  walletPageDescription:
    "Credits from returns and cashback, and debits from checkout.",
  walletTransactionHistory: "Transaction history",
  walletNoTransactions: "No wallet activity yet.",
  walletCredit: "Credit",
  walletDebit: "Debit",
  walletTransactionSourceCodRefund: "COD return refund",
  walletTransactionSourceWalletRefund: "Wallet refund",
  walletTransactionSourceCashback: "Cashback",
  walletTransactionSourceCheckout: "Checkout payment",
  walletTransactionSourceClawback: "Cashback recovery",
  walletTransactionSourceOther: "Adjustment",
  walletBalanceAfter: "Balance after {amount}",

  // Payment split & cashback
  paymentSplitHeading: "Payment",
  paymentSplitWallet: "{amount} from wallet",
  paymentSplitRazorpay: "{amount} via Razorpay",
  paymentSplitCod: "Cash on delivery",
  cashbackPendingAfterDelivery:
    "Cashback pending — credited to wallet after delivery",
  cashbackCreditedToWallet: "{amount} cashback credited to your wallet",
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
  walletAppliedAtCheckout: "Wallet applied",
  amountDueToday: "Due today",

  // Return timelines
} as const;
