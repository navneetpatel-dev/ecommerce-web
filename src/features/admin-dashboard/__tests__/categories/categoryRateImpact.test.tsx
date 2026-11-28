import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { categoriesApi } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import { useCategoryRateImpact } from "../../hooks/categories/useCategoryRateImpact.hook";

const change = {
  kind: "reassign" as const,
  fromCategoryId: "a",
  toCategoryId: "b",
};
const answer = (canApply: boolean, productCount = 2) => ({
  productCount,
  gstChanged: productCount,
  commissionChanged: 0,
  vendors: [],
  canApply,
});

afterEach(() => vi.restoreAllMocks());

describe("changing what vendors are charged by moving categories", () => {
  it("asks for a written reason before it can be sent", async () => {
    vi.spyOn(categoriesApi, "rateImpact").mockResolvedValue(answer(true));
    const { result } = renderHook(() => useCategoryRateImpact(change));
    await waitFor(() => expect(result.current.affected).toBe(true));
    let reason: string | undefined | null;
    act(() => {
      reason = result.current.takeReason();
    });
    expect(reason).toBeNull();
    expect(result.current.reason.error).toBe(LABELS.priceChangeReasonRequired);
    act(() => result.current.reason.onChange("Moved to the right tax group"));
    expect(result.current.takeReason()).toBe("Moved to the right tax group");
  });

  it("blocks an admin without the pricing power", async () => {
    vi.spyOn(categoriesApi, "rateImpact").mockResolvedValue(answer(false));
    const { result } = renderHook(() => useCategoryRateImpact(change));
    await waitFor(() => expect(result.current.blocked).toBe(true));
  });

  it("is blocked while a vendor lacks documents for the target", async () => {
    vi.spyOn(categoriesApi, "rateImpact").mockResolvedValue({
      ...answer(true, 0),
      blockedVendors: [
        { vendorId: "v", businessName: "Spice Co", products: 3 },
      ],
    });
    const { result } = renderHook(() => useCategoryRateImpact(change));
    await waitFor(() => expect(result.current.blocked).toBe(true));
    expect(result.current.notAllowed).toBe(false);
  });

  it("needs nothing when no rate changes", async () => {
    vi.spyOn(categoriesApi, "rateImpact").mockResolvedValue(answer(true, 0));
    const { result } = renderHook(() => useCategoryRateImpact(change));
    await waitFor(() => expect(result.current.checking).toBe(false));
    expect(result.current.takeReason()).toBeUndefined();
  });
});
