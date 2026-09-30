import type { PincodeServiceability } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";

export interface DeliveryAreaStatus {
  /** True once the check has answered for this area (a failed check leaves it false). */
  known: boolean;
  serviceable: boolean;
  /** Vendors in the basket that do not deliver to the pincode. */
  unserviceableVendorIds: string[];
  estimatedDays: { min: number; max: number } | null;
  /**
   * Shown only when every serving vendor agrees on it: "free over ₹X" would be a promise
   * only some of the basket's vendors keep.
   */
  freeShippingThreshold: number | null;
}

/** What every delivery-area surface renders — the shape the owning hooks return. */
export interface DeliveryAreaSummary {
  pincode: string | null;
  status: DeliveryAreaStatus;
  isChecking: boolean;
}

/** "Nothing checked" — what surfaces render before the store hydrates or an area is set. */
const UNKNOWN_DELIVERY_STATUS: DeliveryAreaStatus = {
  known: false,
  serviceable: false,
  unserviceableVendorIds: [],
  estimatedDays: null,
  freeShippingThreshold: null,
};

export const UNKNOWN_DELIVERY_AREA: DeliveryAreaSummary = {
  pincode: null,
  status: UNKNOWN_DELIVERY_STATUS,
  isChecking: false,
};

/**
 * The hard gate: only a *known* "no" blocks. An area nobody checked, or a check that failed,
 * leaves the funnel exactly as it was before this feature — the quote's 422 is the backstop.
 */
export function isDeliveryAreaBlocked(
  area: DeliveryAreaSummary | undefined,
): boolean {
  return Boolean(area?.status.known && !area.status.serviceable);
}

/** Turns the serviceability answer into what the funnel gates and labels on. */
export function resolveDeliveryAreaStatus(
  serviceability: PincodeServiceability | undefined,
): DeliveryAreaStatus {
  if (!serviceability) return UNKNOWN_DELIVERY_STATUS;

  const served = serviceability.vendors.filter((vendor) => vendor.serviceable);
  const thresholds = served
    .map((vendor) => vendor.freeShippingThreshold)
    .filter((value): value is number => value != null);
  const agreeOnThreshold =
    served.length > 0 &&
    thresholds.length === served.length &&
    new Set(thresholds).size === 1;
  // A vendor-scoped answer may only promise what those vendors' own rates promise: the
  // zone-wide threshold is about *other* vendors' rates, so it is not a fallback here.
  const freeShippingThreshold = serviceability.vendors.length
    ? agreeOnThreshold
      ? thresholds[0]!
      : null
    : (serviceability.freeShippingThreshold ?? null);

  return {
    known: true,
    serviceable: serviceability.serviceable,
    unserviceableVendorIds: serviceability.vendors
      .filter((vendor) => !vendor.serviceable)
      .map((vendor) => vendor.vendorId),
    estimatedDays: serviceability.estimatedDays,
    freeShippingThreshold,
  };
}

/** "Delivers to 560001 in 2–5 days" — one day reads differently from a range. */
export function deliveryEtaLabel(
  pincode: string,
  estimatedDays: { min: number; max: number } | null,
): string | null {
  if (!estimatedDays) return null;
  if (estimatedDays.min === estimatedDays.max) {
    return formatLabel(LABELS.deliveryAreaEtaDays, {
      pincode,
      days: estimatedDays.min,
    });
  }
  return formatLabel(LABELS.deliveryAreaEtaRange, {
    pincode,
    min: estimatedDays.min,
    max: estimatedDays.max,
  });
}

/** "Free delivery over ₹499" when the basket's vendors agree on a threshold. */
export function deliveryFreeShippingLabel(
  freeShippingThreshold: number | null,
): string | null {
  if (freeShippingThreshold == null) return null;
  return formatLabel(LABELS.deliveryAreaFreeShipping, {
    amount: formatInrAmount(freeShippingThreshold),
  });
}
