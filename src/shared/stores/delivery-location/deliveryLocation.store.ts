import { create } from "zustand";
import {
  EMPTY_DELIVERY_LOCATION,
  readStoredDeliveryLocation,
  writeStoredDeliveryLocation,
} from "./deliveryLocationStorage";

interface DeliveryLocationState {
  /** The delivery area the customer is shopping in — usually the pincode they checked. */
  pincode: string | null;
  /** Region of that pincode when we know it (the chosen address carries one). */
  state: string | null;
  setDeliveryLocation: (pincode: string, state?: string | null) => void;
  clearDeliveryLocation: () => void;
  /** Called on mount — sessionStorage cannot be read during SSR. */
  hydrate: () => void;
}

let hydrated = false;

/**
 * The delivery area the whole funnel is shopped in (Rule 3: one owner, not per-page state).
 *
 * It lives here rather than in the PDP so a pincode checked on a product page is the same
 * pincode the cart and the checkout address step gate on — the bug this fixes was a
 * serviceability answer that existed only inside the product page that asked for it.
 * Session-scoped: a visitor's area shouldn't outlive the tab, but it must survive the page
 * loads of one purchase.
 */
export const useDeliveryLocationStore = create<DeliveryLocationState>(
  (set) => ({
    ...EMPTY_DELIVERY_LOCATION,
    setDeliveryLocation: (pincode, state = null) => {
      const next = { pincode, state };
      writeStoredDeliveryLocation(next);
      set(next);
    },
    clearDeliveryLocation: () => {
      writeStoredDeliveryLocation(EMPTY_DELIVERY_LOCATION);
      set(EMPTY_DELIVERY_LOCATION);
    },
    hydrate: () => {
      if (hydrated) return;
      hydrated = true;
      set(readStoredDeliveryLocation());
    },
  }),
);
