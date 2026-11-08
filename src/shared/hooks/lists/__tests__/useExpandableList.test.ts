import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { act, renderHook } from "@testing-library/react";
import { useExpandableList } from "../useExpandableList.hook";

describe("U8 + U16: offer lists grow in place", () => {
  it("shows the first few, then all", () => {
    const items = Array.from({ length: 12 }, (_, index) => index);
    const { result } = renderHook(() => useExpandableList(items, 3));
    assert.equal(result.current.visibleItems.length, 3);
    assert.equal(result.current.hiddenCount, 9);
    act(() => result.current.toggleExpanded());
    assert.equal(result.current.visibleItems.length, 12);
  });
  it("no toggle when everything fits", () => {
    const { result } = renderHook(() => useExpandableList([1, 2], 3));
    assert.equal(result.current.canExpand, false);
    assert.equal(result.current.visibleItems.length, 2);
  });
});
