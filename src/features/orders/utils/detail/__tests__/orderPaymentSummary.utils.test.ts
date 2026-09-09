import { describe, expect, it } from "vitest";
import { resolveOrderRazorpayPaid } from "../orderPaymentSummary.utils";

describe("resolveOrderRazorpayPaid", () => {
  it("uses razorpayAmountPaid from the API without fallback math", () => {
    expect(
      resolveOrderRazorpayPaid({
        totalAmount: 500,
        walletAmountUsed: 100,
        razorpayAmountPaid: 400,
        paymentMethod: "RAZORPAY",
        amountDue: 400,
      }),
    ).toBe(400);
  });

  it("returns zero when razorpayAmountPaid is missing", () => {
    expect(
      resolveOrderRazorpayPaid({
        totalAmount: 500,
        walletAmountUsed: 500,
        paymentMethod: "RAZORPAY",
        amountDue: 0,
      }),
    ).toBe(0);
  });
});
