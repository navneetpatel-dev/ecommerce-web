import { describe, expect, it } from "vitest";
import type { CashbackOffer } from "../../api/cashback.api";
import {
  bestOfferForCategory,
  cashbackOfferHeadline,
  cashbackOfferTerms,
  offersForCategories,
} from "../cashbackOfferText";

const offer = (overrides: Partial<CashbackOffer> = {}): CashbackOffer => ({
  id: "o1",
  name: "5% back",
  percent: 5,
  maxCashback: 100,
  minOrderValue: 999,
  categoryIds: [],
  paymentMethods: [],
  startsAt: "2026-11-01T00:00:00Z",
  endsAt: null,
  isActive: true,
  state: "LIVE",
  ...overrides,
});

describe("cashback offer badges", () => {
  it("picks the highest-percentage offer that covers the category", () => {
    const shoes = offer({ id: "o2", percent: 10, categoryIds: ["shoes"] });
    expect(bestOfferForCategory([offer(), shoes], "shoes")?.id).toBe("o2");
    expect(bestOfferForCategory([offer(), shoes], "books")?.id).toBe("o1");
    expect(bestOfferForCategory([shoes], "books")).toBeNull();
    expect(bestOfferForCategory([shoes], undefined)).toBeNull();
  });

  it("lists the offers that cover any cart line", () => {
    const shoes = offer({ id: "o2", categoryIds: ["shoes"] });
    expect(offersForCategories([shoes], ["books", "shoes"])).toEqual([shoes]);
    expect(offersForCategories([shoes], ["books"])).toEqual([]);
  });

  it("states the server's terms", () => {
    expect(cashbackOfferHeadline(offer())).toBe("5% cashback");
    expect(cashbackOfferTerms(offer({ paymentMethods: ["RAZORPAY"] }))).toBe(
      "up to ₹100.00 · on orders above ₹999.00 · on online payment",
    );
    expect(
      cashbackOfferTerms(offer({ maxCashback: null, minOrderValue: 0 })),
    ).toBe("");
  });
});
