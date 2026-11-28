import { describe, expect, it } from "vitest";
import { keepsLastItem } from "../../utils/product-editor/listingRules";

describe("the last variant or image of a listing", () => {
  it("stays while the listing is on sale or awaiting approval", () => {
    expect(keepsLastItem("LIVE", 1)).toBe(true);
    expect(keepsLastItem("PENDING_APPROVAL", 1)).toBe(true);
  });

  it("can go from a draft, or when another remains", () => {
    expect(keepsLastItem("DRAFT", 1)).toBe(false);
    expect(keepsLastItem("LIVE", 2)).toBe(false);
  });
});
