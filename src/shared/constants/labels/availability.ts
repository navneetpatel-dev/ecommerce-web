/** Unavailable-item badges and availability copy. Subset of LABELS; merged in labels/index.ts. */
export const availabilityLabels = {
  unavailableReasonOutOfStock: "Out of stock",
  unavailableReasonLowStock: "Only {count} left",
  cartSetQuantityTo: "Set to {count}",
  unavailableReasonProductUnpublished: "No longer available",
  unavailableReasonVendorUnavailable: "Shop unavailable",
  unavailableReasonNotOnSale: "Not on sale right now",
  unavailableReasonRemoved: "No longer sold",
  aboveMrpAll:
    "Above MRP: not on sale. Raise the MRP (it includes GST) or lower the price.",
  aboveMrpSome: "{count} option(s) above MRP: not on sale.",
  aboveMrpVariant: "Above MRP with GST: not on sale.",
  aboveMrpImpact:
    "Saving this puts {variants} option(s) on {products} listing(s) from {vendors} vendor(s) above their MRP. They stop selling until the vendor corrects the price or MRP.",
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
  searchShops: "Search shops",
  searchShopsPlaceholder: "Shop name",
  shopsCount: "{count} shops",
  noShopsMatch: "No shops match “{term}”",
  noShopsMatchHint:
    "Check the spelling, or clear the search to see every shop.",
  clearSearch: "Clear search",
  noVendorsYetHint:
    "Approved vendors will appear here once they publish their storefront.",
  visitShop: "Visit shop",

  // Coupon messages
} as const;
