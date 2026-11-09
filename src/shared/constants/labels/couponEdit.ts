/** Editing an existing coupon (admin and vendor). Subset of LABELS. */
export const couponEditLabels = {
  editCoupon: "Edit",
  editCouponTitle: "Edit coupon {code}",
  couldNotUpdateCoupon: "Could not save the coupon. Please try again.",
  couponUpdated: "Coupon saved.",
  couponLockedAfterUse:
    "Used {count} times, so its code, type and who bears the discount can't change. Limits, dates, value and minimums still can.",
} as const;
