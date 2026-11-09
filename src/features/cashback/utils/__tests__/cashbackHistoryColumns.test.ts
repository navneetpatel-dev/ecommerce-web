import { describe, expect, it } from "vitest";
import type { CashbackEntry } from "../../api/cashback.api";
import { cashbackSource, cashbackWhen } from "../cashbackHistoryColumns";

const entry = (overrides: Partial<CashbackEntry> = {}): CashbackEntry => ({
  orderId: "ord-1",
  placedAt: "2026-11-01T00:00:00Z",
  amount: 75,
  status: "PENDING",
  expectedCreditOn: null,
  creditedAt: null,
  couponCodes: [],
  offerName: null,
  ...overrides,
});

describe("cashback history cells", () => {
  it("says when the cashback lands", () => {
    expect(cashbackWhen(entry())).toBe("After delivery");
    expect(
      cashbackWhen(entry({ expectedCreditOn: "2026-11-12T00:00:00Z" })),
    ).toMatch(/^Expected /);
    expect(
      cashbackWhen(
        entry({ status: "CREDITED", creditedAt: "2026-11-12T00:00:00Z" }),
      ),
    ).toMatch(/^Credited /);
    expect(cashbackWhen(entry({ status: "CANCELLED" }))).toBe("Not credited");
  });

  it("names its coupon and offer", () => {
    expect(
      cashbackSource(entry({ couponCodes: ["CB50"], offerName: "5% back" })),
    ).toEqual(["Coupon CB50", "5% back"]);
  });
});
