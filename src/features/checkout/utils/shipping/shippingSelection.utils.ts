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
 * so, even when nothing is selected yet. A vendor still loading is pending, and checkout
 * must not continue until that lookup settles.
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
    if (rates === undefined) {
      isRateLookupPending = true;
      continue;
    }
    // An empty list means this seller does not deliver here, picked method or not.
    if (rates.length === 0) {
      unservableVendorIds.push(vendorId);
      continue;
    }
    const method = selectedMethodByVendor[vendorId];
    // Rates exist and nothing is picked yet: the "select a method" state, not a failure.
    if (!method) continue;
    if (!rates.some((rate) => rate.method === method)) {
      unservableVendorIds.push(vendorId);
    }
  }

  return { isRateLookupPending, unservableVendorIds };
}
