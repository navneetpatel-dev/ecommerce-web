import { create } from "zustand";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingMethod } from "@/shared/constants/statuses";

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
  setStep: (step: CheckoutState["step"]) => void;
  setAddress: (id: string) => void;
  setShippingMethod: (vendorId: string, method: ShippingMethod) => void;
  ensureDefaultShippingMethods: (vendorIds: string[]) => void;
  setCouponCode: (code: string | null, opts?: { manual?: boolean }) => void;
  setPaymentMethod: (method: string | null) => void;
  setWalletAmountToUse: (amount: number) => void;
  setGiftWrap: (giftWrap: boolean) => void;
  setGiftMessage: (giftMessage: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  addressId: null,
  shippingMethodByVendor: {},
  appliedCouponCode: null,
  manualCouponOverride: false,
  paymentMethod: null,
  walletAmountToUse: 0,
  giftWrap: false,
  giftMessage: "",
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
}));
