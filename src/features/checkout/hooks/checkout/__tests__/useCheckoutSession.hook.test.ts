import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { CartItem } from "@/shared/api/types";
import { useCheckoutStore } from "../../../store/checkout.store";
import { useCheckoutSession } from "../useCheckoutSession.hook";

function cartItems(ids: string[]): CartItem[] {
  return ids.map((id) => ({ id, quantity: 1 }) as CartItem);
}

/** A flow that looks like it was abandoned mid-checkout on a previous visit. */
function abandonFlowMidWay() {
  const s = useCheckoutStore.getState();
  s.setStep(4);
  s.setAddress("address-1");
  s.setShippingMethod("vendor-1", "EXPRESS");
  s.setCouponCode("SAVE10", { manual: true });
  s.setPaymentMethod("wallet");
  s.setWalletAmountToUse(250);
  s.setGiftWrap(true);
  s.setGiftMessage("Happy birthday");
}

beforeEach(() => {
  useCheckoutStore.getState().resetCheckout();
});

/**
 * The store is module state, so a customer could arrive at checkout on a flow they left
 * behind earlier in the session. Every visit has to start at step 1 — with the address,
 * payment and wallet choices of that earlier flow gone.
 */
describe("useCheckoutSession on arrival", () => {
  it("starts a fresh flow however the store was left", () => {
    abandonFlowMidWay();

    renderHook(() => useCheckoutSession(cartItems(["line-a", "line-b"])));

    const state = useCheckoutStore.getState();
    expect(state.step).toBe(1);
    expect(state.addressId).toBeNull();
    expect(state.shippingMethodByVendor).toEqual({});
    expect(state.appliedCouponCode).toBeNull();
    expect(state.manualCouponOverride).toBe(false);
    expect(state.paymentMethod).toBeNull();
    expect(state.walletAmountToUse).toBe(0);
    expect(state.giftWrap).toBe(false);
    expect(state.giftMessage).toBe("");
  });

  it("adopts the basket it was entered with", () => {
    renderHook(() => useCheckoutSession(cartItems(["line-b", "line-a"])));

    expect(useCheckoutStore.getState().cartSignature).toBe("line-a|line-b");
  });

  it("starts fresh again on a second visit, even with the same basket", () => {
    const items = cartItems(["line-a"]);
    const first = renderHook(() => useCheckoutSession(items));
    abandonFlowMidWay();
    first.unmount();

    renderHook(() => useCheckoutSession(items));

    expect(useCheckoutStore.getState().step).toBe(1);
    expect(useCheckoutStore.getState().paymentMethod).toBeNull();
  });

  it("keeps the step when the basket changes during the visit", () => {
    const { rerender } = renderHook(
      ({ items }: { items: CartItem[] }) => useCheckoutSession(items),
      { initialProps: { items: cartItems(["line-a"]) } },
    );
    const store = useCheckoutStore.getState();
    store.setStep(3);
    store.setAddress("address-1");

    // Quantity edit — and even a line removal that keeps a shared line — is not a new flow.
    rerender({ items: cartItems(["line-a"]) });
    rerender({ items: cartItems(["line-a", "line-b"]) });

    expect(useCheckoutStore.getState().step).toBe(3);
    expect(useCheckoutStore.getState().addressId).toBe("address-1");
  });
});
