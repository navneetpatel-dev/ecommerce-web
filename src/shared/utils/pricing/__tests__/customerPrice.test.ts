import { describe, expect, it } from "vitest";
import { customerPrice, withCustomerPrices } from "../customerPrice";

describe("customerPrice", () => {
  it("shows the GST-inclusive price", () => {
    expect(customerPrice({ basePrice: 1000, displayPrice: 1180 })).toBe(1180);
  });

  it("falls back to the listed price for older payloads", () => {
    expect(customerPrice({ basePrice: 1000 })).toBe(1000);
    expect(customerPrice({ basePrice: 1000, displayPrice: null })).toBe(1000);
  });
});

describe("withCustomerPrices", () => {
  it("prices each variant with GST", () => {
    const variants = withCustomerPrices([
      { id: "a", price: 1000, displayPrice: 1050 },
      { id: "b", price: 1400 },
    ]);
    expect(variants.map((variant) => variant.price)).toEqual([1050, 1400]);
  });
});
