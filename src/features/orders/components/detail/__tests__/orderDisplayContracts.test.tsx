import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderMoneyBreakdown } from "../OrderMoneyBreakdown.component";
import { SubOrderCardTotals } from "../../sub-order/SubOrderCard/SubOrderCardTotals.component";
import type { SubOrder } from "@/shared/api/types";

describe("order display contracts", () => {
  it("does not render zero when paid shipping has no amount", () => {
    render(
      <OrderMoneyBreakdown
        order={{
          totalAmount: 100,
          discountTotal: 0,
          merchandiseSubtotal: 100,
          taxTotal: 18,
          taxDisplayKey: "IGST",
          shippingDisplayKey: "PAID",
        }}
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("IGST")).toBeInTheDocument();
    expect(screen.queryByText("₹0")).not.toBeInTheDocument();
  });

  it("uses the sub-order tax key and guards a missing paid amount", () => {
    render(
      <SubOrderCardTotals
        subOrder={
          {
            id: "sub-1",
            orderId: "order-1",
            vendorId: "vendor-1",
            vendor: {
              id: "vendor-1",
              businessName: "Seller",
              slug: "seller",
              logoUrl: null,
            },
            status: "CONFIRMED",
            subtotal: 100,
            shippingDisplayKey: "PAID",
            taxAmount: 18,
            taxDisplayKey: "CGST_SGST",
            customerTotal: 118,
            items: [],
          } satisfies SubOrder
        }
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("CGST + SGST")).toBeInTheDocument();
  });
});
