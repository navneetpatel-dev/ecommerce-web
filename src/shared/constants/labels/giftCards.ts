/** Gift cards copy. Subset of LABELS; merged in labels.ts (see SHARED FILE CHANGES NEEDED). */
export const giftCardsLabels = {
  giftCards: "Gift Cards",
  giftCardsPageTitle: "Buy a gift card",
  giftCardsPageDescription:
    "Send a gift card by email — the recipient redeems it straight into their wallet balance.",
  giftCardAmount: "Amount",
  giftCardAmountHint: "Choose an amount between ₹{min} and ₹{max}",
  giftCardRecipientEmail: "Recipient email",
  giftCardRecipientName: "Recipient name (optional)",
  giftCardMessage: "Add a message (optional)",
  giftCardBuyButton: "Pay and send gift card",
  giftCardBuyButtonBusy: "Processing…",
  giftCardPurchaseSuccessTitle: "Gift card sent!",
  giftCardPurchaseSuccessBody:
    "We've emailed a gift card worth {amount} to {email}.",
  giftCardBuyAnother: "Buy another gift card",
  giftCardRedeemTitle: "You've received a gift card",
  giftCardRedeemAmountLabel: "Gift card value",
  giftCardRedeemButton: "Redeem to wallet",
  giftCardRedeemButtonBusy: "Redeeming…",
  giftCardRedeemLoginPrompt:
    "Log in or create an account to redeem this gift card.",
  giftCardRedeemSuccessTitle: "Added to your wallet",
  giftCardRedeemSuccessBody: "₹{amount} has been added to your wallet balance.",
  giftCardRedeemViewWallet: "View wallet",
  giftCardNotFoundTitle: "Gift card not found",
  giftCardNotFoundBody:
    "This gift card code doesn't look right. Double-check the link and try again.",
  giftCardExpiredBadge: "Expired",
  giftCardRedeemedBadge: "Already redeemed",
  giftCardCancelledBadge: "Cancelled",
} as const;
