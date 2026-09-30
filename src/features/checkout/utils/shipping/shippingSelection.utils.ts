import type { ShippingRate } from "@/shared/api/types";

/** Rates for one delivery area per vendor; `undefined` until that vendor's lookup settles. */
export type VendorRateMap = Record<string, ShippingRate[] | undefined>;

export type ShippingSelectionStatus = {
  /** True while at least one vendor's rates have not arrived (still loading, or failed). */
  isRateLookupPending: boolean;
  /** Vendors whose picked method has no rate in this delivery area. */
  unservableVendorIds: string[];
};

/**
 * Checkout quotes one shipping rate per vendor and rejects the whole order when a vendor's
 * selected method has no rate for the delivery address ("No shipping rate is available…").
 * The shipping step asks this before letting the customer continue, so an address nobody
 * ships to is fixed there instead of dead-ending on the review step.
 *
 * A vendor with no rates at all for the address counts as unservable — its card already says
 * so — and a vendor still loading is left out of the verdict rather than blocking the button.
 */
export function resolveShippingSelectionStatus(
  vendorIds: string[],
  selectedMethodByVendor: Record<string, string | undefined>,
  ratesByVendor: VendorRateMap,
): ShippingSelectionStatus {
  const unservableVendorIds: string[] = [];
  let isRateLookupPending = false;

  for (const vendorId of vendorIds) {
    const rates = ratesByVendor[vendorId];
    if (!rates) {
      isRateLookupPending = true;
      continue;
    }
    const method = selectedMethodByVendor[vendorId];
    // Nothing picked yet is the "select a method" state, not a delivery failure.
    if (!method) continue;
    if (!rates.some((rate) => rate.method === method)) {
      unservableVendorIds.push(vendorId);
    }
  }

  return { isRateLookupPending, unservableVendorIds };
}
