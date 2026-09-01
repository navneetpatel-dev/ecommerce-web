/** Frontend labels mapped from backend API error codes (see apiErrorMessage.ts). */
export const apiErrorLabels = {
  sessionExpired: "Session expired. Please log in again.",
  rateLimited: "Too many requests. Please wait and try again.",
  vendorUnavailableCheckout:
    "This seller is not available for checkout right now.",
  vendorKycIncomplete: "Complete seller verification before continuing.",
  vendorKycBlocksProduct:
    "This product is unavailable until seller verification is complete.",
  couponNotApplicable: "This coupon does not apply to your cart.",
  couponMinOrder: "Your order does not meet the minimum for this coupon.",
  couponStackConflict:
    "This coupon cannot be combined with others in your cart.",
  couponPriorityConflict: "Another coupon already applies to these items.",
  couponDuplicateScope: "A coupon with this scope already exists.",
  walletInsufficientBalance: "Not enough wallet points for this order.",
  walletInvalidAmount: "Enter a valid wallet amount.",
  walletRechargeDisabled: "Wallet recharge is not available right now.",
  walletMaxBalanceExceeded:
    "This recharge would exceed your wallet balance limit.",
  walletRechargeAlreadyPaid: "This recharge was already completed.",
  codNotAvailable: "Cash on delivery is not available for this order.",
  pincodeInvalidCheckout: "Enter a valid delivery pincode.",
  shippingWeightRequired: "Shipping weight is required for this order.",
  shippingMethodUnsupported: "That shipping method is not available.",
  orderCancelPaidOnly: "Only paid orders can be cancelled.",
  orderCancelShipped: "Shipped orders cannot be cancelled.",
  orderCancelItemsShipped:
    "Some items have already shipped and cannot be cancelled.",
  orderUseCheckout: "Use checkout to cancel this order.",
  checkoutPaidCannotCancel: "Paid checkout orders cannot be cancelled here.",
  notYourOrder: "You do not have access to this order.",
  notYourProductReview: "You can only review products from your own orders.",
  reviewItemNotDelivered: "You can review this product after delivery.",
  reviewAlreadyExists: "You have already reviewed this item.",
  wishlistAlreadyHasProduct: "This product is already in your wishlist.",
  wishlistNoVariants: "Choose a product variant before adding to wishlist.",
  returnAlreadyExists: "A return request already exists for this item.",
  returnNotAllowed: "This item cannot be returned.",
  itemMustBeDelivered: "This item must be delivered before you can continue.",
} as const;
