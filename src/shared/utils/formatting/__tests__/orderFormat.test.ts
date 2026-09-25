import { describe, expect, it } from "vitest";
import {
  formatInr,
  formatInrAmount,
  formatInrCompact,
  formatInrExact,
} from "../orderFormat";

describe("INR formatters", () => {
  it("format server amounts, including decimal strings and zero", () => {
    expect(formatInr(1250.5)).toBe("₹1,250.5");
    expect(formatInr("1250.50")).toBe("₹1,250.5");
    expect(formatInr(0)).toBe("₹0");
    expect(formatInrAmount(99999)).toBe("99,999");
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
});
