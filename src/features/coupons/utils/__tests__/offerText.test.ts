import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { offerDetailText, offerDisplayName } from "../offerText";

const offer = (overrides: Record<string, unknown>) =>
  ({
    code: "C1",
    name: "Free shipping",
    type: "FREE_SHIPPING",
    discount: 0,
    cashbackAmount: 0,
    ...overrides,
  }) as never;

describe("U11: a vendor's offer names its seller", () => {
  it("Free shipping · TechWorld vs plain Free shipping", () => {
    assert.equal(
      offerDisplayName(offer({ sellerName: "TechWorld" })),
      "Free shipping · TechWorld",
    );
    assert.equal(offerDisplayName(offer({})), "Free shipping");
  });
});

describe("U14 + U10: what each offer gives", () => {
  it("cashback says it comes after delivery", () => {
    assert.match(
      offerDetailText(offer({ type: "CASHBACK", cashbackAmount: 50 })),
      /₹50\.00 back in your wallet after delivery/,
    );
  });
  it("an unfinished bundle says what's missing", () => {
    assert.match(
      offerDetailText(
        offer({ type: "BUNDLE", discount: 100, missingCount: 1 }),
      ),
      /Add 1 more to save ₹100\.00/,
    );
  });
  it("a discount says how much it saves", () => {
    assert.match(
      offerDetailText(offer({ type: "FLAT", discount: 120 })),
      /Save ₹120\.00/,
    );
  });
  it("free shipping without an address has no amount", () => {
    assert.equal(offerDetailText(offer({})), "Free shipping");
  });
});
