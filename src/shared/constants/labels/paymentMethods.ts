/** Saved payment methods (account settings) copy; merge into labels.ts. */
export const paymentMethodsLabels = {
  paymentMethodsNavLabel: "Payment methods",
  paymentMethodsNavDescription: "Saved cards and UPI",
  savedPaymentMethods: "Saved payment methods",
  savedPaymentMethodsDesc:
    "Cards and UPI IDs you've chosen to save at checkout",
  noSavedPaymentMethodsHeading: "No saved payment methods yet",
  noSavedPaymentMethodsMessage:
    "Choose to save a card or UPI ID during checkout and it will show up here.",
  couldNotLoadSavedPaymentMethods: "Could not load your saved payment methods.",
  couldNotDeleteSavedPaymentMethod:
    "Could not remove this payment method. Please try again.",
  deleteSavedPaymentMethodTitle: "Remove this payment method?",
  deleteSavedPaymentMethodDescription:
    "This removes it from your account. It may take a little longer to disappear from Razorpay's saved list.",
  cardMethodLabel: "Card",
  upiMethodLabel: "UPI",
} as const;
