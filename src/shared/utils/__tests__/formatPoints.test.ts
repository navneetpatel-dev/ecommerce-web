import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPoints, formatPointsCompact } from "../formatPoints";

describe("formatPoints", () => {
  it("formats whole points with pts suffix", () => {
    assert.equal(formatPoints(1250), "1,250 pts");
  });

  it("formats zero", () => {
    assert.equal(formatPoints(0), "0 pts");
  });
});

describe("formatPointsCompact", () => {
  it("uses K suffix for thousands", () => {
    assert.equal(formatPointsCompact(1200), "1.2K pts");
  });

  it("keeps small values unabbreviated", () => {
    assert.equal(formatPointsCompact(499), "499 pts");
  });
});
