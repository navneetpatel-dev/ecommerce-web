import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CartItem } from "@/shared/api/types";
import { useCartLineViewModel } from "../useCartLineViewModel.hook";

function line(overrides: Partial<CartItem>): CartItem {
  return {
    id: "line-1",
    variantId: "v1",
    quantity: 61,
    maxQuantity: 58,
    isAvailable: false,
    unavailableReason: "LOW_STOCK",
    lineSubtotal: 0,
    lineDisplaySubtotal: 0,
    product: {
      id: "p1",
      name: "Laptop",
      slug: "laptop",
      imageUrl: "",
      price: 100,
    },
    ...overrides,
  } as unknown as CartItem;
}

/** B-66: a line above the remaining stock says how many are left and offers to fix it. */
describe("useCartLineViewModel low stock", () => {
  it("says how many are left and sets the line to that amount", () => {
    const onUpdateQuantity = vi.fn();
    const { result } = renderHook(() =>
      useCartLineViewModel({ item: line({}), onUpdateQuantity }),
    );
    expect(result.current.unavailableReasonText).toBe("Only 58 left");
    expect(result.current.setToAvailableLabel).toBe("Set to 58");
    result.current.handleSetToAvailable();
    expect(onUpdateQuantity).toHaveBeenCalledWith("line-1", 58);
  });

  it("keeps Out of stock, with no fix, when nothing is left", () => {
    const { result } = renderHook(() =>
      useCartLineViewModel({
        item: line({ unavailableReason: "OUT_OF_STOCK", maxQuantity: 0 }),
        onUpdateQuantity: vi.fn(),
      }),
    );
    expect(result.current.unavailableReasonText).toBe("Out of stock");
    expect(result.current.setToAvailableLabel).toBeNull();
  });
});
