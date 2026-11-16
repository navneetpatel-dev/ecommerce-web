import { describe, expect, it } from "vitest";
import {
  countOrderItems,
  formatInr,
  formatInrAmount,
  formatInrCompact,
  formatInrExact,
  formatOrderDate,
} from "../orderFormat";

describe("INR formatters", () => {
  it("format server amounts, including decimal strings and zero", () => {
    expect(formatInr(1250.5)).toBe("₹1,250.50");
    expect(formatInr("1250.50")).toBe("₹1,250.50");
    expect(formatInr(3221.4)).toBe("₹3,221.40");
    expect(formatInr(0)).toBe("₹0.00");
    expect(formatInrAmount(99999)).toBe("99,999.00");
    expect(formatInrExact(1250.5)).toBe("₹1,250.50");
    expect(formatInrCompact(150_000)).toBe("₹1.5L");
  });

  it("show a missing amount as — instead of ₹0", () => {
    for (const missing of [undefined, null, "", "not a number", Number.NaN]) {
      expect(formatInr(missing)).toBe("—");
      expect(formatInrAmount(missing)).toBe("—");
      expect(formatInrExact(missing)).toBe("—");
      expect(formatInrCompact(missing)).toBe("—");
    }
  });

  it("formatOrderDate returns — for empty, null, or invalid dates", () => {
    expect(formatOrderDate(undefined)).toBe("—");
    expect(formatOrderDate(null)).toBe("—");
    expect(formatOrderDate("")).toBe("—");
    expect(formatOrderDate("invalid-date-string")).toBe("—");
    expect(formatOrderDate("2026-03-15T10:30:00.000Z")).toContain("2026");
  });

  it("countOrderItems safely handles empty, null, or missing items", () => {
    expect(countOrderItems(undefined)).toBe(0);
    expect(countOrderItems(null)).toBe(0);
    expect(countOrderItems({})).toBe(0);
    expect(countOrderItems({ subOrders: [] })).toBe(0);
    expect(countOrderItems({ subOrders: [null, { items: undefined }] })).toBe(
      0,
    );
    expect(
      countOrderItems({ subOrders: [{ items: [{}, {}] }, { items: [{}] }] }),
    ).toBe(3);
  });
});
