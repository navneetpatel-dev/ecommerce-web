import { describe, expect, it } from "vitest";
import { fromLocalInputValue, toLocalInputValue } from "../maintenanceTime";

describe("maintenance time conversion", () => {
  it("round-trips a local time through ISO", () => {
    const iso = fromLocalInputValue("2026-11-12T09:30");
    expect(iso).not.toBeNull();
    expect(toLocalInputValue(iso)).toBe("2026-11-12T09:30");
  });

  it("treats empty and invalid values as no end time", () => {
    expect(fromLocalInputValue("")).toBeNull();
    expect(fromLocalInputValue("not a date")).toBeNull();
    expect(toLocalInputValue(null)).toBe("");
    expect(toLocalInputValue("garbage")).toBe("");
  });
});
