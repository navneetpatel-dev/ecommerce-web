import { describe, expect, it } from "vitest";
import { defaultHistoryRange } from "../orderHistoryRange";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Mirrors the reports engine: `to` runs to the end of its IST day; the cap is 366 days. */
const spanDays = ({ from, to }: { from: string; to: string }) =>
  (Date.parse(to) + DAY_MS - 1 - Date.parse(from)) / DAY_MS;

describe("defaultHistoryRange", () => {
  it("stays inside the reports engine's 366-day cap", () => {
    for (const iso of [
      "2026-11-13T06:00:00Z",
      "2028-02-29T20:00:00Z",
      "2026-01-01T00:10:00Z",
    ]) {
      const range = defaultHistoryRange(new Date(iso));
      expect(spanDays(range)).toBeLessThanOrEqual(366);
      expect(spanDays(range)).toBeGreaterThan(365);
    }
  });

  it("uses the IST date for today", () => {
    // 20:00 UTC is already the next day in India.
    expect(defaultHistoryRange(new Date("2026-11-13T20:00:00Z")).to).toBe(
      "2026-11-14",
    );
  });
});
