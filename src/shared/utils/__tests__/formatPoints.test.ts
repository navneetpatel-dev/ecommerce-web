import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatPoints,
  formatPointsCompact,
  formatPointsHeaderBadge,
} from "../formatPoints";

describe("formatPoints", () => {
  it("formats whole points with pts suffix", () => {
    assert.equal(formatPoints(1250), "1,250 pts");
  });

  it("formats zero", () => {
    assert.equal(formatPoints(0), "0 pts");
  });
});

describe("formatPointsCompact", () => {
  it("uses K suffix with decimals for thousands", () => {
    assert.equal(formatPointsCompact(1200), "1.2K pts");
    assert.equal(formatPointsCompact(2022), "2.02K pts");
    assert.equal(formatPointsCompact(10000), "10K pts");
  });

  it("keeps small values unabbreviated", () => {
    assert.equal(formatPointsCompact(499), "499 pts");
  });
});

describe("formatPointsHeaderBadge", () => {
  it("uses K notation with proper decimals", () => {
    assert.equal(formatPointsHeaderBadge(0), "0");
    assert.equal(formatPointsHeaderBadge(2022), "2.02K");
    assert.equal(formatPointsHeaderBadge(1200), "1.2K");
    assert.equal(formatPointsHeaderBadge(10000), "10K");
    assert.equal(formatPointsHeaderBadge(499), "499");
  });
});
