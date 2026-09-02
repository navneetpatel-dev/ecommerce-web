import { describe, expect, it } from "vitest";
import { describeApplyResult } from "../couponMessages";

const makeResult = (
  discount: number,
  cashbackAmount: number,
  payNowGrandTotal?: number,
): Parameters<typeof describeApplyResult>[0] =>
  ({ discount, cashbackAmount, payNowGrandTotal }) as Parameters<
    typeof describeApplyResult
  >[0];

describe("describeApplyResult", () => {
  it("announces the discount amount for plain coupons", () => {
    const message = describeApplyResult(makeResult(120, 0));
    expect(message).toContain("120");
    expect(message).not.toContain("cashback");
  });

  it("describes pay-now vs cashback for cashback coupons", () => {
    const message = describeApplyResult(makeResult(0, 250, 1000));
    expect(message).toMatch(/1,?000/);
    expect(message).toMatch(/250/);
  });

  it("falls back to checkout message when pay-now total is absent", () => {
    const message = describeApplyResult(makeResult(0, 250));
    expect(message).toBeTruthy();
    expect(message).not.toMatch(/₹/);
  });

  it("falls back to the applied-at-checkout message otherwise", () => {
    const message = describeApplyResult(makeResult(0, 0));
    expect(message.length).toBeGreaterThan(0);
  });
});
