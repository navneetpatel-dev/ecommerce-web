import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import type { ShippingMethod } from "@/shared/constants/statuses";

/** The choices a reload should not lose (B-56). */
export interface StoredCheckoutFlow {
  step: 1 | 2 | 3 | 4;
  addressId: string | null;
  shippingMethodByVendor: Record<string, ShippingMethod>;
  appliedCouponCode: string | null;
  manualCouponOverride: boolean;
  paymentMethod: string | null;
  walletAmountToUse: number;
  giftWrap: boolean;
  giftMessage: string;
  cartSignature: string | null;
}

/** A flow older than this is not resumed: prices and stock may have moved on. */
const MAX_AGE_MS = 30 * 60 * 1000;

const isStep = (value: unknown): value is StoredCheckoutFlow["step"] =>
  value === 1 || value === 2 || value === 3 || value === 4;

/** The flow saved in this tab, or null when there is none, it is stale, or storage fails. */
export function readStoredCheckoutFlow(
  now = Date.now(),
): StoredCheckoutFlow | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.CHECKOUT_FLOW);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      savedAt?: number;
      flow?: StoredCheckoutFlow;
    };
    const flow = parsed.flow;
    if (!flow || typeof parsed.savedAt !== "number") return null;
    if (now - parsed.savedAt > MAX_AGE_MS || !isStep(flow.step)) return null;
    return flow;
  } catch {
    return null;
  }
}

export function writeStoredCheckoutFlow(
  flow: StoredCheckoutFlow,
  now = Date.now(),
): void {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEYS.CHECKOUT_FLOW,
      JSON.stringify({ savedAt: now, flow }),
    );
  } catch {
    /* Storage unavailable: a reload starts over, as before. */
  }
}

export function clearStoredCheckoutFlow(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEYS.CHECKOUT_FLOW);
  } catch {
    /* Nothing to clear. */
  }
}

/** The persisted part of the store's state. */
export function pickCheckoutFlow(
  state: StoredCheckoutFlow,
): StoredCheckoutFlow {
  return {
    step: state.step,
    addressId: state.addressId,
    shippingMethodByVendor: state.shippingMethodByVendor,
    appliedCouponCode: state.appliedCouponCode,
    manualCouponOverride: state.manualCouponOverride,
    paymentMethod: state.paymentMethod,
    walletAmountToUse: state.walletAmountToUse,
    giftWrap: state.giftWrap,
    giftMessage: state.giftMessage,
    cartSignature: state.cartSignature,
  };
}
