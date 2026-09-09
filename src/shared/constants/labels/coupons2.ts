/** Copy subset (part 2); merged via labels.ts. */
export const coupons2Labels = {
  each: "each",
  heroSlideImageUnavailable: "{headline} image not available",
  completeYourOrderTitle: "Complete your order",
  completeYourOrderMessage:
    "Sign in to place your order and track it in your account.",
  addShippingAddressTitle: "Add a shipping address",
  addShippingAddressMessage: "Sign in to save addresses and continue checkout.",
  signInRequired: "Sign in required",
  backToOrders: "Back to orders",
  orderDetails: "Order details",
  placedOn: "Placed {date}",
  sellerSingular: "seller",
  sellerPlural: "sellers",
  itemSingular: "item",
  itemPlural: "items",
  orderSummary: "Order summary",
  whatYouPaid: "What you paid",
  whatYouOrdered: "What you ordered",
  orderTotalsHeading: "Order total",
  itemsLine: "Items",
  discount: "Discount",
  shippingTo: "Shipping to",
  qtyLabel: "Qty {count}",
  taxIgst: "IGST",
  taxCgstSgst: "CGST + SGST",
  enterBatchName: "Enter a batch name.",
  enterBulkCount: "Enter how many codes to generate.",
  bulkGenerateHint: "Complete the batch fields to generate codes.",
  createVendorCoupon: "Create vendor coupon",
  noVendorCoupons: "No vendor coupons",
  couponVendorScopeLocked: "Scope is locked to your vendor catalog.",
  usageUnlimited: "∞",
  appliedCouponsHeading: "Applied coupons",
  removeCouponCode: "Remove {code}",

  // Checkout / cart / payment
  vendorTotal: "Vendor total",
  sellerTotal: "Seller total",
  subtotal: "Subtotal",
  shipping: "Shipping",
  shippingAndTax: "Shipping & tax",
  taxGst: "GST",
  taxesAtCheckout: "Calculated at checkout",
  freeShipping: "Free",
  payableNow: "Payable now",
  includingShippingTaxes: "Including shipping and taxes",
  placeOrder: "Place order",
  placingOrder: "Placing your order…",
  placingOrderBody:
    "Hang tight — we're reserving your items and preparing checkout.",
  confirmingPayment: "Confirming your payment…",
  confirmingPaymentBody:
    "Payment received. We're verifying it with our payment partner.",
  orderPlacedRedirect: "Order placed",
  orderPlacedRedirectBody: "Taking you to your order confirmation…",
  restoringCart: "Restoring your cart…",
  restoringCartBody:
    "We're putting your items back in your cart so you can try again.",
  cartEmptyCheckoutTitle: "Your cart needs a moment",
  cartEmptyCheckoutBody:
    "Your items are being restored. Please wait a moment, then try placing your order again.",
  orderDetailsLoading: "Loading order details…",
  orderDetailsLoadFailed:
    "We couldn't load payment details right now. View your order for the full breakdown.",
  paymentUnavailableTitle: "Payment unavailable",
  paymentUnavailableLoadScript:
    "Unable to load payment checkout. Please try again.",
  paymentUnavailableMissingDetails:
    "Payment could not be started. Missing order details from server.",
  paymentConfirmationPendingTitle: "Confirmation pending",
  paymentConfirmationPendingBody:
    "Payment was received, but confirmation is still settling. Check Orders shortly.",
  paymentCancelledTitle: "Payment cancelled",
  paymentCancelledBody:
    "No charge was made. Your cart has been restored and is ready whenever you want to try again.",
  paymentFailedTitle: "Payment failed",
  paymentFailedBody:
    "Payment could not be completed. Your cart has been restored so you can try again.",
  placeOrderFailedTitle: "Could not place order",
  placeOrderFailedBody: "Could not place order. Please try again.",
  itemsUnavailableTitle: "Items unavailable",
  backToPayment: "Back to payment",
  preparingSummary: "Preparing your summary",
  calculatingShippingTaxes: "Calculating shipping and taxes for your order…",
  summaryLoadFailed:
    "We couldn't calculate shipping and taxes. Go back to payment and try again.",
  couldNotLoadShippingRates:
    "Could not load shipping rates for this delivery area.",
  couponCodeLabel: "Coupon code",
  yourCart: "Your Cart",
  closeCart: "Close cart",
  cartEmptyHeading: "Your cart is empty",
  cartEmptyMessage: "Add some items to get started.",
  checkout: "Checkout",
  viewFullCart: "View full cart",
  total: "Total",
  /** Amount slot when the cart request failed — distinct from "Updating…". */
  amountUnavailable: "Unavailable",
  amountsLoadFailed: "We couldn't load prices just now.",
  retryPrices: "Retry",

  // Tables / pagination
} as const;
