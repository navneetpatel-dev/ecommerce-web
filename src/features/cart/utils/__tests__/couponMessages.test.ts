import { describe, expect, it } from "vitest";
import { describeApplyResult } from "../couponMessages";
import type { Cart } from "@/shared/api/types";

const cartBase = {
  id: "cart-1",
  total: 1000,
} as unknown as Cart;

const makeResult = (
  discount: number,
  cashbackAmount: number,
): Parameters<typeof describeApplyResult>[0] =>
  ({ discount, cashbackAmount }) as Parameters<typeof describeApplyResult>[0];

describe("describeApplyResult", () => {
  it("announces the discount amount for plain coupons", () => {
    const message = describeApplyResult(makeResult(120, 0), cartBase);
    expect(message).toContain("120");
    expect(message).not.toContain("cashback");
  });

  it("describes pay-now vs cashback for cashback coupons", () => {
    const message = describeApplyResult(makeResult(0, 250), {
      ...cartBase,
      total: 1000,
    });
    expect(message).toMatch(/1,?000/);
    expect(message).toMatch(/250/);
  });

  it("falls back to the applied-at-checkout message otherwise", () => {
    const message = describeApplyResult(makeResult(0, 0), cartBase);
    expect(message.length).toBeGreaterThan(0);
  });
});
