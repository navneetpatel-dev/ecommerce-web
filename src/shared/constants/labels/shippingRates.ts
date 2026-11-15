/**
 * Shipping rate admin copy. Not yet merged into the root `LABELS` object —
 * imported directly by the shipping-rates admin components/hooks until a
 * maintainer folds it into `labels.ts` (see task report "SHARED FILE CHANGES
 * NEEDED"). Keep flat string keys so the merge is a drop-in later.
 */
export const shippingRatesLabels = {
  shippingRates: "Shipping Rates",
  addShippingRate: "Add shipping rate",
  zone: "Zone",
  selectZone: "Select a zone",
  method: "Method",
  minWeightGrams: "Min weight (g)",
  maxWeightGrams: "Max weight (g)",
  price: "Price",
  estimatedDays: "Estimated days",
  freeShippingThreshold: "Free shipping threshold (incl. GST)",
  freeShippingThresholdOptional:
    "Free shipping threshold, incl. GST (optional)",
  vendorIdOptional: "Vendor ID (optional, per-vendor override)",
  vendorOptional: "Vendor (optional, per-vendor override)",
  allVendorsDefault: "Platform default (all vendors)",
  selectVendor: "Select a vendor",
  couldNotLoadShippingRates: "Could not load shipping rates.",
  couldNotCreateShippingRate: "Could not create shipping rate.",
  selectZoneToCreateRate: "Select a zone to continue.",
  deleteShippingRate: "Delete shipping rate",
  deleteShippingRateConfirm:
    "Are you sure you want to delete this shipping rate? This action cannot be undone.",
} as const;
