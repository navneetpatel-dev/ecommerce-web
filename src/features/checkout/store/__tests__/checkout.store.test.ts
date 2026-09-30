import { beforeEach, describe, expect, it } from "vitest";
import { useCheckoutStore } from "../checkout.store";

/** Everything a flow selects, as one object — assertions read against this. */
function selection() {
  const s = useCheckoutStore.getState();
  return {
    step: s.step,
    addressId: s.addressId,
    shippingMethodByVendor: s.shippingMethodByVendor,
    appliedCouponCode: s.appliedCouponCode,
    manualCouponOverride: s.manualCouponOverride,
    paymentMethod: s.paymentMethod,
    walletAmountToUse: s.walletAmountToUse,
    giftWrap: s.giftWrap,
    giftMessage: s.giftMessage,
  };
}

/** Drive a flow to a fully selected state, as the checkout steps would. */
function selectEverything() {
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

const FRESH = {
  step: 1,
  addressId: null,
  shippingMethodByVendor: {},
  appliedCouponCode: null,
  manualCouponOverride: false,
  paymentMethod: null,
  walletAmountToUse: 0,
  giftWrap: false,
  giftMessage: "",
};

describe("checkout store session", () => {
  beforeEach(() => {
    useCheckoutStore.getState().resetCheckout();
  });

  it("starts every flow from the same fresh state", () => {
    expect(selection()).toEqual(FRESH);
  });

  it("resetCheckout clears every selection of a finished flow", () => {
    selectEverything();
    expect(selection()).not.toEqual(FRESH);

    useCheckoutStore.getState().resetCheckout();

    expect(selection()).toEqual(FRESH);
    expect(useCheckoutStore.getState().cartSignature).toBeNull();
  });

  it("adopts the first basket without discarding the flow", () => {
    useCheckoutStore.getState().setStep(2);

    useCheckoutStore.getState().syncCartSignature("line-a|line-b");

    expect(useCheckoutStore.getState().cartSignature).toBe("line-a|line-b");
    expect(useCheckoutStore.getState().step).toBe(2);
  });

  it("keeps the flow while the customer edits the same basket", () => {
    const { syncCartSignature, setStep } = useCheckoutStore.getState();
    syncCartSignature("line-a|line-b");
    setStep(4);
    useCheckoutStore.getState().setAddress("address-1");

    // Quantity change / one line removed, one kept.
    useCheckoutStore.getState().syncCartSignature("line-a");

    expect(useCheckoutStore.getState().step).toBe(4);
    expect(useCheckoutStore.getState().addressId).toBe("address-1");
  });

  it("starts fresh for a different basket — the second-purchase bug", () => {
    const { syncCartSignature } = useCheckoutStore.getState();
    syncCartSignature("line-a|line-b");
    selectEverything();
    useCheckoutStore.getState().syncCartSignature("line-a|line-b");

    useCheckoutStore.getState().syncCartSignature("line-c");

    expect(selection()).toEqual(FRESH);
    expect(useCheckoutStore.getState().cartSignature).toBe("line-c");
  });

  it("starts fresh when the basket was emptied by the order that went through", () => {
    const { syncCartSignature } = useCheckoutStore.getState();
    syncCartSignature("line-a");
    selectEverything();

    useCheckoutStore.getState().syncCartSignature("");

    expect(selection()).toEqual(FRESH);
  });

  it("leaves the flow alone when the same basket is synced twice", () => {
    const { syncCartSignature } = useCheckoutStore.getState();
    syncCartSignature("line-a");
    selectEverything();

    useCheckoutStore.getState().syncCartSignature("line-a");

    expect(useCheckoutStore.getState().step).toBe(4);
    expect(useCheckoutStore.getState().appliedCouponCode).toBe("SAVE10");
  });

  it("prunes shipping methods for vendors that left the basket", () => {
    const s = useCheckoutStore.getState();
    s.setShippingMethod("vendor-1", "EXPRESS");
    s.setShippingMethod("vendor-2", "STANDARD");

    useCheckoutStore.getState().pruneShippingMethods(["vendor-1"]);

    expect(useCheckoutStore.getState().shippingMethodByVendor).toEqual({
      "vendor-1": "EXPRESS",
    });
  });
});
