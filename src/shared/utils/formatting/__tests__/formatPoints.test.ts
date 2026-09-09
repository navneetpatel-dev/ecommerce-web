import { describe, expect, it } from "vitest";
import {
  formatPoints,
  formatPointsCompact,
  formatPointsHeaderBadge,
} from "../formatPoints";

describe("formatPoints", () => {
  it("formats whole points with pts suffix", () => {
    expect(formatPoints(1250)).toBe("1,250 pts");
  });

  it("formats zero", () => {
    expect(formatPoints(0)).toBe("0 pts");
  });
});

describe("formatPointsCompact", () => {
  it("uses K suffix with decimals for thousands", () => {
    expect(formatPointsCompact(1200)).toBe("1.2K pts");
    expect(formatPointsCompact(2022)).toBe("2.02K pts");
    expect(formatPointsCompact(10000)).toBe("10K pts");
  });

  it("keeps small values unabbreviated", () => {
    expect(formatPointsCompact(499)).toBe("499 pts");
  });
});

describe("formatPointsHeaderBadge", () => {
  it("uses K notation with proper decimals", () => {
    expect(formatPointsHeaderBadge(0)).toBe("0");
    expect(formatPointsHeaderBadge(2022)).toBe("2.02K");
    expect(formatPointsHeaderBadge(1200)).toBe("1.2K");
    expect(formatPointsHeaderBadge(10000)).toBe("10K");
    expect(formatPointsHeaderBadge(499)).toBe("499");
  });
});
