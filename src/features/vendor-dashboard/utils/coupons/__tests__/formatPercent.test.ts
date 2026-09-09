import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { formatPercent } from "../formatPercent";

describe("formatPercent", () => {
  it("rounds a 0-1 ratio to a whole percentage", () => {
    assert.equal(formatPercent(0.1234), "12%");
    assert.equal(formatPercent(1), "100%");
    assert.equal(formatPercent(0), "0%");
  });

  it("renders an em dash for missing values", () => {
    assert.equal(formatPercent(null), "—");
    assert.equal(formatPercent(undefined), "—");
  });
});
