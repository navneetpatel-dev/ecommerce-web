import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { inventoryApi } from "../../api/inventory/inventory.api";
import { useInventoryStockEditor } from "../../hooks/inventory/useInventoryStockEditor.hook";

vi.mock("@/shared/stores/notifications/toast.store", () => ({
  notifySuccess: vi.fn(),
}));

afterEach(() => vi.restoreAllMocks());

describe("editing stock from the inventory list (E3)", () => {
  it("reports a failed save so the dialog stays open with the message", async () => {
    vi.spyOn(inventoryApi, "updateStock").mockRejectedValue(new Error("no"));
    const onSaved = vi.fn();
    const { result } = renderHook(() => useInventoryStockEditor(5, "v1"));
    let saved = true;
    await act(async () => {
      saved = await result.current.save(onSaved);
    });
    expect(saved).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("starts again from the row's current stock when reopened", () => {
    const { result, rerender } = renderHook(
      ({ stock }) => useInventoryStockEditor(stock, "v1"),
      { initialProps: { stock: 5 } },
    );
    act(() => result.current.setStock("99"));
    rerender({ stock: 8 });
    act(() => result.current.reset());
    expect(result.current.stock).toBe("8");
  });
});
