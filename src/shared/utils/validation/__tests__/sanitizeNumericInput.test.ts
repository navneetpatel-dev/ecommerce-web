import { describe, expect, it } from "vitest";
import {
  sanitizeNumericText,
  stripLeadingZeros,
} from "../sanitizeNumericInput";

describe("stripLeadingZeros", () => {
  it("strips leading zeros from integers while keeping single zero", () => {
    expect(stripLeadingZeros("01000")).toBe("1000");
    expect(stripLeadingZeros("00042")).toBe("42");
    expect(stripLeadingZeros("000")).toBe("0");
    expect(stripLeadingZeros("0")).toBe("0");
    expect(stripLeadingZeros("")).toBe("");
  });

  it("preserves decimal fractions like 0.5 and strips leading zeros on whole part", () => {
    expect(stripLeadingZeros("010.50")).toBe("10.50");
    expect(stripLeadingZeros("00.75")).toBe("0.75");
    expect(stripLeadingZeros("0.25")).toBe("0.25");
    expect(stripLeadingZeros("-0100")).toBe("-100");
  });

  it("sanitizes mixed numeric text cleanly", () => {
    expect(sanitizeNumericText("01000abc", { allowDecimal: false })).toBe(
      "1000",
    );
    expect(sanitizeNumericText("0012.34.5", { allowDecimal: true })).toBe(
      "12.345",
    );
  });
});
