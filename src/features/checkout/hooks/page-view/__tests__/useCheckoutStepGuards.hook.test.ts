import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { CheckoutQuote } from "@/shared/api/types";
import { useCheckoutStore } from "../../../store/checkout.store";
import { useCheckoutStepGuards } from "../useCheckoutStepGuards.hook";

function quote(partial: Partial<CheckoutQuote> = {}): CheckoutQuote {
  return {
    vendorBreakdowns: [],
    grandTotal: 1200,
    cashbackAmount: 0,
    walletBalance: 0,
    walletAmountToUse: 0,
    amountDue: 1200,
    appliedCoupon: null,
    codAvailable: true,
    orderTotals: {
      merchandiseSubtotal: 1200,
      shippingTotal: 0,
      shippingDisplayKey: "FREE",
      taxTotal: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      discountTotal: 0,
      taxDisplayKey: "GST",
    },
    ...partial,
  };
}

const READY = {
  groupedByVendor: { "vendor-1": {} } as Record<string, unknown>,
  shippingReady: true,
  addressesResolved: true,
  quoteResolved: true,
};

function renderGuards(
  input: Partial<Parameters<typeof useCheckoutStepGuards>[0]> = {},
) {
  return renderHook(() =>
    useCheckoutStepGuards({ ...READY, quote: quote(), ...input }),
  );
}

/** Drive the stored flow to a finished-looking state, as the steps would. */
function finishFlow() {
  const s = useCheckoutStore.getState();
  s.setStep(4);
  s.setAddress("address-1");
  s.setShippingMethod("vendor-1", "STANDARD");
  s.setPaymentMethod("cod");
}

beforeEach(() => {
  useCheckoutStore.getState().resetCheckout();
});

/**
 * The stored step outlives the selections that justified it (a second visit, another tab,
 * a vendor dropping out of the basket), so the guards have to walk it back instead of
 * leaving the customer on review with nothing behind it.
 */
describe("useCheckoutStepGuards", () => {
  it("seeds the standard method for every vendor in the basket", () => {
    renderGuards({ groupedByVendor: { "vendor-1": {}, "vendor-2": {} } });

    expect(useCheckoutStore.getState().shippingMethodByVendor).toEqual({
      "vendor-1": "STANDARD",
      "vendor-2": "STANDARD",
    });
  });

  it("drops the method of a vendor that left the basket", () => {
    useCheckoutStore.getState().setShippingMethod("vendor-2", "EXPRESS");

    renderGuards();

    expect(useCheckoutStore.getState().shippingMethodByVendor).toEqual({
      "vendor-1": "STANDARD",
    });
  });

  it("walks back to step 1 when the chosen address is gone", () => {
    useCheckoutStore.getState().setStep(4);

    renderGuards();

    expect(useCheckoutStore.getState().step).toBe(1);
  });

  it("keeps the step while the quote is still in flight", () => {
    finishFlow();

    renderGuards({
      quote: undefined,
      quoteResolved: false,
      shippingReady: false,
    });

    expect(useCheckoutStore.getState().step).toBe(4);
  });

  it("walks back to shipping when a vendor has no rate for the address", () => {
    finishFlow();

    renderGuards({ shippingReady: false });

    expect(useCheckoutStore.getState().step).toBe(2);
  });

  it("clears a payment method the quote made unavailable and steps back to payment", () => {
    finishFlow();

    renderGuards({ quote: quote({ codAvailable: false }) });

    expect(useCheckoutStore.getState().paymentMethod).toBeNull();
    expect(useCheckoutStore.getState().step).toBe(3);
  });
});
