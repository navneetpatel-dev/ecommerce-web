/**
 * Back-in-stock "Notify me" copy (PDP + wishlist). NOT yet merged into the root
 * `labels.ts` — see "SHARED FILE CHANGES NEEDED" in the task report; import
 * directly from this module until then.
 */
export const stockAlertsLabels = {
  cancelHeading: "Cancel this stock alert",
  cancelBody: "We will no longer email you when this item is back in stock.",
  cancelConfirm: "Cancel alert",
  cancelDoneHeading: "Alert cancelled",
  cancelDoneBody: "You will not be emailed about this item.",
  cancelInvalid: "This link is not valid.",
  cancelFailed: "The alert could not be cancelled. Try again.",
  cancelGoShopping: "Continue shopping",
  notifyMeChooseOption: "Choose option",
  notifyMe: "Notify me",
  notifyMeEmailPlaceholder: "Enter your email",
  notifyMeSubmit: "Notify me",
  notifyMeCancel: "Cancel",
  notifyMeSubscribed: "We'll email you when this is back in stock",
  notifyMeInvalidEmail: "Enter a valid email address",
  notifyMeError: "Couldn't set up your alert. Please try again.",
} as const;
