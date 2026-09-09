import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderConfirmationItems } from "../OrderConfirmationItems.component";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import type { Order, OrderItem, SubOrder } from "@/shared/api/types";

function item(partial: Partial<OrderItem> & Pick<OrderItem, "id">): OrderItem {
  return {
    variantId: `var-${partial.id}`,
    productName: "Fragrances Max 441",
    quantity: 2,
    unitPrice: 1897.94,
    lineSubtotal: 3795.88,
    lineTotal: 3985.67,
    ...partial,
  } as OrderItem;
}

function subOrder(items: OrderItem[]): SubOrder {
  return {
    id: "sub-1",
    orderId: "order-1",
    vendorId: "vendor-1",
    vendor: {
      id: "vendor-1",
      businessName: "AutoZone",
      slug: "autozone",
      logoUrl: null,
    },
    status: "PENDING",
    subtotal: 3795.88,
    customerTotal: 3985.67,
    items,
  } as SubOrder;
}

const order = (items: OrderItem[]) =>
  ({ subOrders: [subOrder(items)] }) as Pick<Order, "subOrders">;

describe("OrderConfirmationItems", () => {
  it("shows the vendor, the product and its frozen line total", () => {
    render(<OrderConfirmationItems order={order([item({ id: "i-1" })])} />);

    expect(screen.getByText("AutoZone")).toBeInTheDocument();
    expect(screen.getByText("Fragrances Max 441")).toBeInTheDocument();
    // lineTotal from the API, not quantity × unitPrice recomputed here.
    // Rendered twice: the compact slot and the sm+ column, as cart lines do.
    expect(screen.getAllByText("₹3,985.67")).toHaveLength(2);
  });

  it("labels the vendor group the way the cart does", () => {
    render(<OrderConfirmationItems order={order([item({ id: "i-1" })])} />);

    expect(screen.getByText("Sold by")).toBeInTheDocument();
    expect(screen.getByText("1 item")).toBeInTheDocument();
  });

  it("shows quantity, variant options and the unit price", () => {
    render(
      <OrderConfirmationItems
        order={order([
          item({
            id: "i-1",
            variantAttributes: { Size: "XS", Color: "Black" },
          }),
        ])}
      />,
    );

    expect(screen.getByText("Qty 2")).toBeInTheDocument();
    expect(screen.getByText("XS · Black")).toBeInTheDocument();
    expect(screen.getByText(/₹1,897.94/)).toBeInTheDocument();
  });

  it("omits the each-price when only one was ordered", () => {
    render(
      <OrderConfirmationItems
        order={order([item({ id: "i-1", quantity: 1 })])}
      />,
    );

    expect(screen.queryByText(/each/)).not.toBeInTheDocument();
  });

  it("links to the product when the catalogue still has it", () => {
    render(
      <OrderConfirmationItems
        order={order([item({ id: "i-1", productSlug: "product-441" })])}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Fragrances Max 441/ }),
    ).toHaveAttribute("href", "/products/product-441");
  });

  it("still renders a delisted product, just without a link", () => {
    render(
      <OrderConfirmationItems
        order={order([item({ id: "i-1", productSlug: null, imageUrl: null })])}
      />,
    );

    expect(screen.getByText("Fragrances Max 441")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Fragrances Max 441/ }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when the order has no packages", () => {
    const { container } = render(
      <OrderConfirmationItems
        order={{ subOrders: [] } as Pick<Order, "subOrders">}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("keeps the thumbnail inside a positioned wrapper", () => {
    // MediaImage renders <Image fill>, which is position:absolute. Without a
    // positioned wrapper it escapes to the nearest positioned ancestor and
    // covers the page — this is the guard for that regression.
    const { container } = render(
      <OrderConfirmationItems
        order={order([
          item({ id: "i-1", imageUrl: "https://example.test/a.jpg" }),
        ])}
      />,
    );

    const thumb = container.querySelector(".aspect-square");
    expect(thumb).not.toBeNull();
    expect(thumb?.className).toContain("relative");
    expect(thumb?.className).toContain("overflow-hidden");
  });

  it("wraps each seller in the shared vendor-group card", () => {
    // Cart, confirmation and order detail must separate packages identically;
    // this fails if the confirmation page stops using the shared shell.
    const { container } = render(
      <OrderConfirmationItems order={order([item({ id: "i-1" })])} />,
    );

    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    for (const cls of VENDOR_GROUP_CARD.split(" ")) {
      expect(section?.className).toContain(cls);
    }
  });
});
