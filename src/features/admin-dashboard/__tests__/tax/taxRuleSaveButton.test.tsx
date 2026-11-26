import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { LABELS } from "@/shared/constants/labels";
import { taxApi } from "../../api/tax/tax.api";
import { useTaxRuleForm } from "../../hooks/tax/useTaxRuleForm.hook";

vi.mock("@/features/products", () => ({}));

const rule = {
  id: "r",
  categoryId: null,
  categoryName: null,
  isDefault: true,
  hsnCode: null,
  gstPercentage: 18,
  priceBandThreshold: null,
  gstPercentageAbove: null,
  appliesToCount: 0,
  createdAt: "",
} as never;

const noRules = { items: [], page: 1, totalPages: 1, total: 0 } as never;

describe("tax rule Save button", () => {
  beforeEach(() => {
    vi.spyOn(taxApi, "getRules").mockResolvedValue(noRules);
  });
  afterEach(() => vi.restoreAllMocks());

  it("a new rule can be saved as is; a half-filled price band blocks it with the reason", () => {
    const { result } = renderHook(() => useTaxRuleForm({ onSaved: vi.fn() }));
    expect(result.current.saveBlockedReason).toBeNull();
    act(() => result.current.patch({ priceBandThreshold: "500" }));
    expect(result.current.saveBlockedReason).toBe(
      LABELS.gstPriceBandIncomplete,
    );
  });

  it("a bad HSN blocks it", () => {
    const { result } = renderHook(() => useTaxRuleForm({ onSaved: vi.fn() }));
    act(() => result.current.patch({ hsnCode: "123" }));
    expect(result.current.saveBlockedReason).toBe(LABELS.taxRuleHsnInvalid);
  });

  it("editing without a change is blocked until something changes", () => {
    const { result } = renderHook(() =>
      useTaxRuleForm({ rule, onSaved: vi.fn() }),
    );
    expect(result.current.saveBlockedReason).toBe(LABELS.taxRuleNoChanges);
    act(() => result.current.patch({ gstChoice: "12" }));
    expect(result.current.saveBlockedReason).toBeNull();
  });

  it("is blocked up front when a default rule already exists, and again for a taken category", async () => {
    vi.spyOn(taxApi, "getRules").mockResolvedValue({
      ...(noRules as object),
      items: [{ id: "other" }],
    } as never);
    const { result } = renderHook(() => useTaxRuleForm({ onSaved: vi.fn() }));
    await waitFor(() =>
      expect(result.current.saveBlockedReason).toBe(LABELS.taxRuleDefaultTaken),
    );
    act(() => result.current.patch({ categoryId: "c1" }));
    await waitFor(() =>
      expect(result.current.saveBlockedReason).toBe(
        LABELS.taxRuleCategoryTaken,
      ),
    );
  });

  it("after the server refuses, it stays blocked with that message until the form changes", async () => {
    vi.spyOn(taxApi, "createRule").mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useTaxRuleForm({ onSaved: vi.fn() }));
    await act(() => result.current.submit());
    expect(result.current.saveBlockedReason).toBeTruthy();
    act(() => result.current.patch({ hsnCode: "1234" }));
    expect(result.current.saveBlockedReason).toBeNull();
  });
});
