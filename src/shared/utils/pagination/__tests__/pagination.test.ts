import { describe, expect, it } from "vitest";
import { getPaginationItems } from "../pagination";

describe("getPaginationItems boundary and adversarial tests", () => {
  it("returns empty array for invalid totalPages", () => {
    expect(getPaginationItems(1, 0)).toEqual([]);
    expect(getPaginationItems(1, -5)).toEqual([]);
    expect(getPaginationItems(1, Number.NaN)).toEqual([]);
    expect(getPaginationItems(1, Number.POSITIVE_INFINITY)).toEqual([]);
  });

  it("handles single page safely", () => {
    expect(getPaginationItems(1, 1)).toEqual([1]);
    expect(getPaginationItems(Number.NaN, 1)).toEqual([1]);
    expect(getPaginationItems(-10, 1)).toEqual([1]);
  });

  it("handles small page counts without ellipsis", () => {
    expect(getPaginationItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles large page counts with correct ellipsis placement", () => {
    // Current page near start
    const startItems = getPaginationItems(2, 20);
    expect(startItems[0]).toBe(1);
    expect(startItems).toContain("ellipsis");
    expect(startItems[startItems.length - 1]).toBe(20);

    // Current page near end
    const endItems = getPaginationItems(19, 20);
    expect(endItems[0]).toBe(1);
    expect(endItems).toContain("ellipsis");
    expect(endItems[endItems.length - 1]).toBe(20);

    // Current page in middle
    const midItems = getPaginationItems(10, 20);
    expect(midItems[0]).toBe(1);
    expect(midItems.filter((i) => i === "ellipsis").length).toBe(2);
    expect(midItems[midItems.length - 1]).toBe(20);
  });

  it("safely handles out-of-range or NaN currentPage", () => {
    const itemsNaN = getPaginationItems(Number.NaN, 10);
    expect(itemsNaN[0]).toBe(1);
    expect(itemsNaN[itemsNaN.length - 1]).toBe(10);

    const itemsNeg = getPaginationItems(-100, 10);
    expect(itemsNeg[0]).toBe(1);

    const itemsOverflow = getPaginationItems(999, 10);
    expect(itemsOverflow[0]).toBe(1);
  });
});
