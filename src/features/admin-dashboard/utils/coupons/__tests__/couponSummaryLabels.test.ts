import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { couponValidityLabel, couponValueLabel } from "../couponSummary";

describe("U26: a tiered coupon shows every tier", () => {
  it("5% · 20% over ₹2,000.00", () => {
    const label = couponValueLabel({
      type: "TIERED",
      value: 5,
      config: {
        tiers: [
          { minSubtotal: 1, percent: 5 },
          { minSubtotal: 2000, percent: 20 },
        ],
      },
    });
    assert.match(label, /^5% · 20% over ₹2,000\.00$/);
  });

  it("keeps a first tier's own minimum", () => {
    const label = couponValueLabel({
      type: "TIERED",
      value: 10,
      config: {
        tiers: [
          { minSubtotal: 1000, percent: 10 },
          { minSubtotal: 2000, percent: 20 },
        ],
      },
    });
    assert.match(label, /^10% over ₹1,000\.00 · 20% over ₹2,000\.00$/);
  });

  it("other types are unchanged", () => {
    assert.equal(couponValueLabel({ type: "PERCENTAGE", value: 10 }), "10%");
  });
});

describe("U3: both dates in one column", () => {
  it("start – end, dates only", () => {
    const label = couponValidityLabel({
      startDate: "2026-11-08T08:45:00.000Z",
      endDate: "2026-11-28T08:45:00.000Z",
    });
    assert.match(label, /^8 Nov 2026 – 28 Nov 2026$/);
  });
});
