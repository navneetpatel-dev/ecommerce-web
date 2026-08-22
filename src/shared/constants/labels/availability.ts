/** Unavailable-item badges and availability copy. Subset of LABELS; merged in labels/index.ts. */
export const availabilityLabels = {
  unavailableReasonOutOfStock: "Out of stock",
  unavailableReasonProductUnpublished: "No longer available",
  unavailableReasonVendorUnavailable: "Shop unavailable",
  unavailableGeneric: "Unavailable",

  // Cart / checkout unavailability
  removeUnavailableToCheckout: "Remove unavailable items to continue",

  // Vendor storefront unavailable
  shopUnavailableHeading: "This shop is unavailable",
  shopUnavailableBody:
    "The shop you are looking for is no longer active or has been removed.",
  browseOtherShops: "Browse other shops",
  vendorsIndexEyebrow: "Makers",
  vendorsIndexHint: "Explore approved shops on {site}.",
  noVendorsYet: "No shops to show yet",
  noVendorsYetHint:
    "Approved vendors will appear here once they publish their storefront.",
  visitShop: "Visit shop",

  // Coupon messages
} as const;
