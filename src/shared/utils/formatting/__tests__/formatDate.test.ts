import { describe, expect, it } from "vitest";
import { formatSessionDateTime } from "../formatDate";

describe("formatSessionDateTime", () => {
  it("includes seconds and an uppercase AM/PM period", () => {
    const value = new Date(2026, 8, 3, 13, 5, 9);

    expect(formatSessionDateTime(value)).toMatch(/^3 Sept? 2026, 01:05:09 PM$/);
  });

  it("preserves invalid values for diagnostic display", () => {
    expect(formatSessionDateTime("invalid-date")).toBe("invalid-date");
  });
});
