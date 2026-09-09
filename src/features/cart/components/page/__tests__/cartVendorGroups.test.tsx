import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VendorGroups } from "../CartPageView/VendorGroups.component";
import { VENDOR_GROUP_CARD } from "@/shared/styles/orders/vendorGroupStyles";
import type { CartItem } from "@/shared/api/types";

function cartItem(id: string): CartItem {
  return {
    id,
    variantId: `var-${id}`,
    quantity: 2,
    lineSubtotal: 1900.06,
    maxQuantity: 14,
    isAvailable: true,
    unavailableReason: null,
    product: {
      id: `prod-${id}`,
      name: "Laptops Pro 265",
      slug: "laptops-pro-265",
      imageUrl: "",
      price: 950.03,
      vendor: {
        id: "vendor-1",
        businessName: "GemGallery",
        slug: "gemgallery",
        logoUrl: null,
      },
    },
    variant: { sku: "SKU-1", attributes: { Size: "XS" }, weightGrams: 500 },
  } as CartItem;
}

const handlers = { onUpdateQuantity: vi.fn(), onRemoveItem: vi.fn() };

describe("cart vendor groups", () => {
  it("wraps each seller in the shared vendor-group card", () => {
    // Same shell as order confirmation and order detail, so a seller's package
    // is separated identically on every surface.
    const { container } = render(
      <VendorGroups
        groupedByVendor={{ "vendor-1": [cartItem("i-1")] }}
        {...handlers}
      />,
    );

    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    for (const cls of VENDOR_GROUP_CARD.split(" ")) {
      expect(section?.className).toContain(cls);
    }
  });

  it("labels the group with the seller and its quantity", () => {
    render(
      <VendorGroups
        groupedByVendor={{ "vendor-1": [cartItem("i-1")] }}
        {...handlers}
      />,
    );

    expect(screen.getByText("Sold by")).toBeInTheDocument();
    expect(screen.getByText("GemGallery")).toBeInTheDocument();
    // Cart counts total quantity, not line count.
    expect(screen.getByText(/2\s+items/)).toBeInTheDocument();
  });
});
