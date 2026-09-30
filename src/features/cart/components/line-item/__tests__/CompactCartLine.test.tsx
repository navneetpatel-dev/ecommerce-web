import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CartItem } from "@/shared/api/types";
import { CompactCartLine } from "../CartLineItem/CompactCartLine.component";

const item: CartItem = {
  id: "cart-item-1",
  variantId: "variant-1",
  quantity: 1,
  lineSubtotal: 100,
  /** What the customer sees for the line: GST included (server-priced). */
  lineDisplaySubtotal: 118,
  isAvailable: true,
  unavailableReason: null,
  product: {
    id: "product-1",
    name: "Makeup Premium 107",
    slug: "makeup-premium-107",
    imageUrl: "https://example.com/image.jpg",
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

/** Tailwind spacing step (1 = 0.25rem) in px. */
const spacing = (token: string) => Number(token) * 4;

function heightOf(className: string): number {
  const found = /(^|\s)h-([\d.]+)(\s|$)/.exec(className);
  return found ? spacing(found[2]!) : 0;
}

function renderLine() {
  return render(
    <CompactCartLine
      item={item}
      onUpdateQuantity={vi.fn()}
      onRemoveItem={vi.fn()}
    />,
  );
}

/**
 * The drawer row is a 56px thumbnail beside two content rows (title + remove button, then
 * amount + stepper). Page-sized 44px stepper cells made that block 80px tall, so the stepper
 * hung below the image and the row grew to 96px — the drawer has to stay drawer-sized.
 */
describe("CompactCartLine sizing", () => {
  it("sizes the stepper cells like the remove button beside them", () => {
    renderLine();

    const decrement = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    const increment = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    const remove = screen.getByRole("button", { name: /remove/i });

    const cellHeight = heightOf(decrement.className);
    expect(cellHeight).toBe(heightOf(remove.className));
    // 32px: comfortably inside the 56px thumbnail band the stepper sits in.
    expect(cellHeight).toBeLessThanOrEqual(36);
    expect(increment.className).not.toContain("h-11");
  });

  it("keeps the two content rows within the thumbnail plus the row's padding", () => {
    const { container } = renderLine();

    const grid = container.querySelector("div.grid");
    const gap = spacing(
      /gap-y-([\d.]+)/.exec(grid?.className ?? "")?.[1] ?? "0",
    );
    const block =
      heightOf(screen.getByRole("button", { name: /remove/i }).className) +
      gap +
      heightOf(
        screen.getByRole("button", { name: /increase quantity/i }).className,
      );

    // 2 × 32px rows + 2px gap = 66px; the reported regression was 80px (2 × 32 + 44 in the
    // old layout, which pushed the buttons below the image).
    expect(block).toBeLessThanOrEqual(68);
  });

  it("still renders the line itself: image, title, price and stepper", () => {
    renderLine();

    expect(screen.getByText("Makeup Premium 107")).toBeInTheDocument();
    expect(screen.getByText("₹118")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /click to edit/i }),
    ).toBeInTheDocument();
  });
});
