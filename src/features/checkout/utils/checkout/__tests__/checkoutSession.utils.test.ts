import { describe, expect, it } from "vitest";
import {
  checkoutCartSignature,
  isNewCheckoutSession,
  resolveCheckoutStepCap,
} from "../checkoutSession.utils";

describe("checkoutCartSignature", () => {
  it("ignores line order and quantity — an edit of the same basket keeps the flow", () => {
    const before = checkoutCartSignature([{ id: "line-b" }, { id: "line-a" }]);
    const after = checkoutCartSignature([{ id: "line-a" }, { id: "line-b" }]);

    expect(before).toBe("line-a|line-b");
    expect(after).toBe(before);
  });

  it("is empty for a missing or empty basket", () => {
    expect(checkoutCartSignature(undefined)).toBe("");
    expect(checkoutCartSignature([])).toBe("");
  });
});

describe("isNewCheckoutSession", () => {
  it("adopts the first basket without treating it as new", () => {
    expect(isNewCheckoutSession(null, "line-a")).toBe(false);
    expect(isNewCheckoutSession("", "line-a")).toBe(false);
  });

  it("keeps the flow while the basket shares a line", () => {
    expect(isNewCheckoutSession("line-a|line-b", "line-b|line-c")).toBe(false);
  });

  it("starts fresh for a basket that shares no line — the second-purchase case", () => {
    expect(isNewCheckoutSession("line-a|line-b", "line-c")).toBe(true);
  });

  it("starts fresh once the basket was emptied (the order that just went through)", () => {
    expect(isNewCheckoutSession("line-a", "")).toBe(true);
  });
});

describe("resolveCheckoutStepCap", () => {
  const ready = {
    addressChosen: true,
    quoteResolved: true,
    shippingReady: true,
    paymentValid: true,
  };

  it("caps at step 4 when every selection is in place", () => {
    expect(resolveCheckoutStepCap(ready)).toBe(4);
  });

  it("caps at step 1 while no delivery address is chosen", () => {
    expect(resolveCheckoutStepCap({ ...ready, addressChosen: false })).toBe(1);
  });

  it("does not judge while the quote is still in flight", () => {
    expect(
      resolveCheckoutStepCap({
        ...ready,
        quoteResolved: false,
        shippingReady: false,
        paymentValid: false,
      }),
    ).toBe(4);
  });

  it("caps at step 2 when a vendor has no rate for the address", () => {
    expect(resolveCheckoutStepCap({ ...ready, shippingReady: false })).toBe(2);
  });

  it("caps at step 3 when the payment method is no longer usable", () => {
    expect(resolveCheckoutStepCap({ ...ready, paymentValid: false })).toBe(3);
  });

  it("stops at the first gap (address before shipping)", () => {
    expect(
      resolveCheckoutStepCap({
        ...ready,
        addressChosen: false,
        shippingReady: false,
      }),
    ).toBe(1);
  });
});
