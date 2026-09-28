import { describe, expect, it } from "vitest";
import { formatDate, formatSessionDateTime, formatTime } from "../formatDate";

describe("formatDate", () => {
  it("renders an ISO timestamp as an en-IN day-month-year date", () => {
    expect(formatDate("2026-09-03T10:15:00.000Z")).toMatch(
      /^\d{1,2} Sept? 2026$/,
    );
  });

  it("accepts a Date as well as a string", () => {
    expect(formatDate(new Date(2026, 8, 3))).toMatch(/^3 Sept? 2026$/);
  });

  it("preserves invalid values for diagnostic display", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("formatTime", () => {
  it("renders a 2-digit 12-hour clock with an uppercase period", () => {
    const value = new Date(2026, 8, 3, 15, 42);

    // ICU uses a narrow no-break space before the period in newer runtimes.
    expect(formatTime(value)).toMatch(/^03:42[\s\u202f]?PM$/);
  });

  it("preserves invalid values for diagnostic display", () => {
    expect(formatTime("not-a-date")).toBe("not-a-date");
  });
});

describe("formatSessionDateTime", () => {
  it("includes seconds and an uppercase AM/PM period", () => {
    const value = new Date(2026, 8, 3, 13, 5, 9);

    expect(formatSessionDateTime(value)).toMatch(/^3 Sept? 2026, 01:05:09 PM$/);
  });

  it("preserves invalid values for diagnostic display", () => {
    expect(formatSessionDateTime("invalid-date")).toBe("invalid-date");
  });
});
