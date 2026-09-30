import { create } from "zustand";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingMethod } from "@/shared/constants/statuses";
import { isNewCheckoutSession } from "../utils/checkout/checkoutSession.utils";

interface CheckoutState {
  step: 1 | 2 | 3 | 4;
  addressId: string | null;
  shippingMethodByVendor: Record<string, ShippingMethod>;
  appliedCouponCode: string | null;
  /** When true, auto-apply must not replace the customer's chosen code. */
  manualCouponOverride: boolean;
  paymentMethod: string | null;
  walletAmountToUse: number;
  giftWrap: boolean;
  giftMessage: string;
  /**
   * The basket these choices were made for (see checkoutSession.utils). Not rendered — it
   * exists so a *different* basket can be told apart from an edit of the current one, which
   * is what decides whether the flow starts fresh. Deliberately in memory only: a reload
   * has no flow to resume, and nothing here should survive the tab.
   */
  cartSignature: string | null;
  setStep: (step: CheckoutState["step"]) => void;
  setAddress: (id: string) => void;
  setShippingMethod: (vendorId: string, method: ShippingMethod) => void;
  ensureDefaultShippingMethods: (vendorIds: string[]) => void;
  /** Drop methods for vendors no longer in the basket (the quote keys off the rest). */
  pruneShippingMethods: (vendorIds: string[]) => void;
  setCouponCode: (code: string | null, opts?: { manual?: boolean }) => void;
  setPaymentMethod: (method: string | null) => void;
  setWalletAmountToUse: (amount: number) => void;
  setGiftWrap: (giftWrap: boolean) => void;
  setGiftMessage: (giftMessage: string) => void;
  /** Start over: every selection below belongs to a flow that is finished or stale. */
  resetCheckout: () => void;
  /** Point the flow at the basket being checked out, resetting it when that basket is new. */
  syncCartSignature: (signature: string) => void;
}

/** The state every new checkout flow starts from — `resetCheckout` restores exactly this. */
const initialCheckoutState = {
  step: 1 as const,
  addressId: null,
  shippingMethodByVendor: {},
  appliedCouponCode: null,
  manualCouponOverride: false,
  paymentMethod: null,
  walletAmountToUse: 0,
  giftWrap: false,
  giftMessage: "",
  cartSignature: null,
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...initialCheckoutState,
  setStep: (step) => set({ step }),
  setAddress: (addressId) => set({ addressId }),
  setShippingMethod: (vendorId, method) =>
    set((s) => ({
      shippingMethodByVendor: {
        ...s.shippingMethodByVendor,
        [vendorId]: method,
      },
    })),
  ensureDefaultShippingMethods: (vendorIds) =>
    set((s) => {
      let changed = false;
      const next = { ...s.shippingMethodByVendor };
      for (const vendorId of vendorIds) {
        if (!next[vendorId]) {
          next[vendorId] = SHIPPING_METHOD.STANDARD;
          changed = true;
        }
      }
      return changed ? { shippingMethodByVendor: next } : s;
    }),
  pruneShippingMethods: (vendorIds) =>
    set((s) => {
      const kept = Object.entries(s.shippingMethodByVendor).filter(
        ([vendorId]) => vendorIds.includes(vendorId),
      );
      return kept.length === Object.keys(s.shippingMethodByVendor).length
        ? s
        : { shippingMethodByVendor: Object.fromEntries(kept) };
    }),
  setCouponCode: (code, opts) =>
    set((s) => ({
      appliedCouponCode: code,
      manualCouponOverride:
        opts?.manual === true
          ? true
          : opts?.manual === false
            ? false
            : s.manualCouponOverride,
    })),
  setPaymentMethod: (paymentMethod) =>
    set((s) => ({
      paymentMethod,
      // Points apply only when Wallet is the selected payment method.
      walletAmountToUse: paymentMethod === "wallet" ? s.walletAmountToUse : 0,
    })),
  setWalletAmountToUse: (walletAmountToUse) => set({ walletAmountToUse }),
  setGiftWrap: (giftWrap) =>
    set((s) => ({ giftWrap, giftMessage: giftWrap ? s.giftMessage : "" })),
  setGiftMessage: (giftMessage) => set({ giftMessage }),
  resetCheckout: () => set({ ...initialCheckoutState }),
  syncCartSignature: (signature) =>
    set((s) => {
      if (s.cartSignature === signature) return s;
      // A basket that shares no line with this flow's is a new purchase: start at step 1.
      return isNewCheckoutSession(s.cartSignature, signature)
        ? { ...initialCheckoutState, cartSignature: signature }
        : { cartSignature: signature };
    }),
}));
