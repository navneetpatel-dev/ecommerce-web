/** Return reason options. Subset of LABELS; merged in labels/index.ts. */
export const returnsLabels = {
  returnReasonDamaged: "Damaged",
  returnReasonWrongItem: "Wrong item",
  returnReasonNotAsDescribed: "Not as described",
  returnReasonNoLongerNeeded: "No longer needed",
  returnReasonOther: "Other",
  vendorReturnsHint:
    "Return requests on your orders — reason, customer photos, pickup tracking, and status.",
  returnPhotos: "Photos",
  viewReturnPhotos: "View photos",
  couldNotLoadReturn: "Could not load this return.",
  backToReturns: "Back to returns",
  returnNotFound: "Return not found",
  returnNotFoundMessage:
    "This return may have been removed, or you may not have access to view it.",

  returnDetailHeading: "Return details",
  // Cancel a requested return (B-50)
  cancelReturn: "Cancel return",
  cancelReturnTitle: "Cancel this return?",
  cancelReturnBody:
    "The request is withdrawn and the item stays with you. You can request a return again while the return window is open.",
  keepReturn: "Keep return",
  returnCancelled: "Return cancelled.",
  couldNotCancelReturn: "Could not cancel this return.",

  // Unavailable item badges
} as const;
