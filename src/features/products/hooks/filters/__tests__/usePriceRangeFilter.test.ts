import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { usePriceRangeFilter } from "../usePriceRangeFilter.hook";

describe("price range filter (B-19)", () => {
  it("does not apply min above max and says why", () => {
    const onUpdateFilter = vi.fn();
    const { result } = renderHook(() =>
      usePriceRangeFilter({
        minPrice: undefined,
        maxPrice: 100,
        onUpdateFilter,
      }),
    );
    act(() => result.current.handleMinChange(5000));
    expect(result.current.error).toBe(LABELS.priceRangeInvalid);
    expect(onUpdateFilter).not.toHaveBeenCalled();
  });

  it("applies a valid range", () => {
    const onUpdateFilter = vi.fn();
    const { result } = renderHook(() =>
      usePriceRangeFilter({
        minPrice: undefined,
        maxPrice: 1200,
        onUpdateFilter,
      }),
    );
    act(() => result.current.handleMinChange(1000));
    expect(result.current.error).toBeNull();
    expect(onUpdateFilter).toHaveBeenCalledWith("minPrice", 1000);
    expect(onUpdateFilter).toHaveBeenCalledWith("maxPrice", 1200);
  });
});
