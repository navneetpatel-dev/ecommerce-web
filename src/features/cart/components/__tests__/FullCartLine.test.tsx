import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CartItem } from "@/shared/api/types";
import { FullCartLine } from "../CartLineItem/FullCartLine.component";

const item: CartItem = {
  id: "cart-item-1",
  variantId: "variant-1",
  quantity: 1,
  lineSubtotal: 100,
  isAvailable: true,
  unavailableReason: null,
  product: {
    id: "product-1",
    name: "Product without image",
    slug: "product-without-image",
    imageUrl: "",
    price: 100,
    vendor: {
      id: "vendor-1",
      businessName: "Seller",
      slug: "seller",
      logoUrl: null,
    },
  },
  variant: {
    sku: "SKU-1",
    attributes: {},
  },
};

describe("FullCartLine", () => {
  it("shows the shared placeholder when the product image is missing", () => {
    render(
      <FullCartLine
        item={item}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("img", { name: "Image not available" }),
    ).toHaveAttribute("data-image-state", "unavailable");
    expect(
      screen.queryByRole("img", { name: item.product.name }),
    ).not.toBeInTheDocument();
  });
});
