/** My gift cards, the admin gift card list, and gift cards at checkout. Subset of LABELS. */
export const giftCardsManageLabels = {
  // Customer: my gift cards
  myGiftCards: "My gift cards",
  myGiftCardsDescription:
    "Cards you've sent and cards you've redeemed into your wallet.",
  giftCardsPurchased: "Sent by you",
  giftCardsRedeemedByYou: "Redeemed by you",
  giftCardsPurchasedEmpty: "You haven't sent a gift card yet.",
  giftCardsRedeemedEmpty: "You haven't redeemed a gift card yet.",
  giftCardCode: "Code",
  giftCardRecipient: "Recipient",
  giftCardFrom: "From",
  giftCardStatus: "Status",
  giftCardSentOn: "Sent",
  giftCardExpires: "Expires",
  giftCardRedeemedOn: "Redeemed",
  giftCardResend: "Email again",
  giftCardResent: "Gift card emailed again to {email}.",
  giftCardResendFailed: "Could not email the gift card. Please try again.",
  giftCardSendOne: "Send a gift card",
  giftCardSomeone: "Someone",

  // Admin
  adminGiftCards: "Gift cards",
  adminGiftCardsDescription:
    "Every gift card sold, what customers can still redeem, and deactivation.",
  giftCardOutstanding: "Can still be redeemed",
  giftCardOutstandingCount: "Active cards",
  giftCardIssued: "Sold",
  giftCardRedeemedTotal: "Redeemed",
  giftCardExpiredTotal: "Expired",
  giftCardCancelledTotal: "Deactivated",
  giftCardSearchPlaceholder: "Code, recipient or buyer email",
  giftCardAllStatuses: "All statuses",
  giftCardBuyer: "Buyer",
  giftCardRedeemer: "Redeemed by",
  giftCardDeactivate: "Deactivate",
  giftCardDeactivateTitle: "Deactivate gift card {code}?",
  giftCardDeactivateBody:
    "It can no longer be redeemed. This does not refund the buyer; it is recorded in the audit log.",
  giftCardDeactivatePlaceholder: "Why is this card being deactivated?",
  giftCardDeactivated: "Gift card deactivated.",
  giftCardDeactivateFailed: "Could not deactivate the gift card.",
  giftCardsTableAria: "Gift cards",

  // Checkout
  checkoutGiftCardTitle: "Have a gift card?",
  checkoutGiftCardHint:
    "Its value is added to your wallet and applied to this order. Anything left over stays in your wallet.",
  checkoutGiftCardCode: "Gift card code",
  checkoutGiftCardApply: "Apply",
  checkoutGiftCardApplied:
    "Gift card {code} added {amount} to your wallet, applied to this order.",
  checkoutGiftCardFailed: "Could not apply this gift card.",
  checkoutGiftCardNotFound:
    "No gift card has this code. Check it and try again.",
} as const;
