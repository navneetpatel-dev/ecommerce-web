import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CartItem } from "@/shared/api/types";
import { RemoveCartItemAction } from "../RemoveCartItemAction.component";

const item = {
  id: "item-1",
  variantId: "variant-1",
  quantity: 1,
  isAvailable: true,
  unavailableReason: null,
  product: {
    id: "product-1",
    name: "Test product",
    slug: "test-product",
    imageUrl: "",
    price: 100,
    vendor: {
      id: "vendor-1",
      businessName: "Seller",
      slug: "seller",
      logoUrl: null,
    },
  },
  variant: { sku: "SKU-1", attributes: {} },
} satisfies CartItem;

describe("RemoveCartItemAction", () => {
  it("removes the named item only after danger confirmation", async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();

    render(<RemoveCartItemAction item={item} onRemoveItem={onRemoveItem} />);

    await user.click(
      screen.getByRole("button", { name: "Remove Test product" }),
    );
    expect(onRemoveItem).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveTextContent(
      "Remove “Test product” from your cart?",
    );

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemoveItem).toHaveBeenCalledOnce();
    expect(onRemoveItem).toHaveBeenCalledWith("item-1");
  });
});
