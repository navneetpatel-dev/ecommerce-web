import { PINCODE_PATTERN } from "@/shared/constants/geo/pincode";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

export interface StoredDeliveryLocation {
  pincode: string | null;
  /** Region of that pincode when we know it (the chosen address carries one). */
  state: string | null;
}

export const EMPTY_DELIVERY_LOCATION: StoredDeliveryLocation = {
  pincode: null,
  state: null,
};

/**
 * Session-scoped delivery area (Rule: storage is never trusted). A cleared store, a parse
 * failure, a pincode that no longer looks valid, or a private-mode quota error all degrade
 * to "no area set" instead of taking the funnel down with them.
 */
export function readStoredDeliveryLocation(): StoredDeliveryLocation {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.DELIVERY_LOCATION);
    if (!raw) return EMPTY_DELIVERY_LOCATION;
    const parsed = JSON.parse(raw) as Partial<StoredDeliveryLocation>;
    const pincode = typeof parsed.pincode === "string" ? parsed.pincode : null;
    if (!pincode || !PINCODE_PATTERN.test(pincode))
      return EMPTY_DELIVERY_LOCATION;
    return {
      pincode,
      state: typeof parsed.state === "string" ? parsed.state : null,
    };
  } catch {
    return EMPTY_DELIVERY_LOCATION;
  }
}

export function writeStoredDeliveryLocation(
  location: StoredDeliveryLocation,
): void {
  try {
    if (!location.pincode) {
      window.sessionStorage.removeItem(STORAGE_KEYS.DELIVERY_LOCATION);
      return;
    }
    window.sessionStorage.setItem(
      STORAGE_KEYS.DELIVERY_LOCATION,
      JSON.stringify(location),
    );
  } catch {
    /* Storage unavailable (private mode / quota) — the area stays in memory. */
  }
}
