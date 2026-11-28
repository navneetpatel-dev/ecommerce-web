import { describe, expect, it } from "vitest";
import { resolveCheckoutCouponCodes } from "../checkoutCouponCodes.utils";

describe("resolveCheckoutCouponCodes (#9)", () => {
  it("sends the cart's applied coupons", () => {
    expect(
      resolveCheckoutCouponCodes({
        appliedCoupons: [{ code: "A", discount: 10 }],
      }),
    ).toEqual(["A"]);
  });

  it("sends an empty list when none apply, so a dead coupon can't block checkout", () => {
    expect(resolveCheckoutCouponCodes({ appliedCoupons: [] })).toEqual([]);
    expect(resolveCheckoutCouponCodes({})).toEqual([]);
  });

  it("sends nothing until the cart has loaded", () => {
    expect(resolveCheckoutCouponCodes(undefined)).toBeUndefined();
  });
});
