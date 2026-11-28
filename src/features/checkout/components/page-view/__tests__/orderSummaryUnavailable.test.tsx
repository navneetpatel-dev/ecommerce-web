import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { UNAVAILABLE_REASON } from "@/shared/constants/statuses";
import type { CartItem } from "@/shared/api/types";
import { useOrderSummaryPanel } from "../../../hooks/page-view/useOrderSummaryPanel.hook";
import { OrderSummaryItemRow } from "../CheckoutPageView/OrderSummaryItemRow.component";

vi.mock("@/shared/components/media/MediaImage.component", () => ({
  MediaImage: () => null,
}));

const line = (over: Partial<CartItem>) =>
  ({
    id: "line-1",
    quantity: 2,
    lineSubtotal: 200,
    lineDisplaySubtotal: 210,
    isAvailable: true,
    product: { name: "Pot", imageUrl: null },
    ...over,
  }) as CartItem;
const removed = line({
  id: "line-2",
  quantity: 1,
  isAvailable: false,
  unavailableReason: UNAVAILABLE_REASON.VARIANT_REMOVED,
});

describe("checkout order summary", () => {
  it("shows the price of a line that can be bought", () => {
    render(<OrderSummaryItemRow item={line({})} />);
    expect(screen.getByRole("listitem")).toHaveTextContent("210");
  });

  it("shows why instead of a price for a line that cannot be bought", () => {
    render(<OrderSummaryItemRow item={removed} />);
    const row = screen.getByRole("listitem");
    expect(row).toHaveTextContent(LABELS.unavailableReasonRemoved);
    expect(row).not.toHaveTextContent("210");
  });

  it("counts only the items the total includes", () => {
    const { result } = renderHook(() =>
      useOrderSummaryPanel({
        groupedByVendor: { v1: [line({}), removed] },
      }),
    );
    expect(result.current.itemCountText).toBe("2 items");
  });
});
