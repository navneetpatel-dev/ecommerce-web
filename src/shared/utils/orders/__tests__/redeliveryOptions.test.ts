import { describe, expect, it } from "vitest";
import {
  MAX_REDELIVERY_DAYS_AHEAD,
  redeliveryDayOptions,
} from "../redeliveryOptions";

describe("redeliveryDayOptions", () => {
  it("offers tomorrow to 14 days ahead on Indian days", () => {
    // 20:00 UTC on 11 Nov is 01:30 on 12 Nov in India, so tomorrow is 13 Nov.
    const options = redeliveryDayOptions(new Date("2026-11-11T20:00:00Z"));
    expect(options).toHaveLength(MAX_REDELIVERY_DAYS_AHEAD);
    expect(options[0]?.value).toBe("2026-11-13");
    expect(options.at(-1)?.value).toBe("2026-11-26");
    expect(options[0]?.label).toMatch(/13/);
  });

  it("never offers today", () => {
    const options = redeliveryDayOptions(new Date("2026-11-11T06:00:00Z"));
    expect(options[0]?.value).toBe("2026-11-12");
  });
});
