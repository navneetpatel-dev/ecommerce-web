import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SubOrder } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { SubOrderInvoicesList } from "../SubOrderInvoicesList.component";

function sub(overrides: Partial<SubOrder> & { id: string }): SubOrder {
  return {
    orderId: "order-1",
    vendorId: "vendor-1",
    vendor: {
      id: "vendor-1",
      businessName: "GlamourGoods",
      slug: "glamourgoods",
      logoUrl: null,
    },
    status: "DELIVERED",
    subtotal: 100,
    customerTotal: 118,
    items: [],
    ...overrides,
  } as SubOrder;
}

describe("SubOrderInvoicesList", () => {
  it("explains a disabled part instead of greeting the customer with a grey name", () => {
    render(
      <SubOrderInvoicesList
        subOrders={[
          sub({ id: "so-1", status: "PENDING", taxInvoiceNumber: null }),
        ]}
        stateBySubOrder={{ "so-1": "awaitingDispatch" }}
        invoicePending={false}
        pendingSubOrderId={null}
        onDownloadSubOrderInvoice={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", {
      name: `GlamourGoods · ${LABELS.taxInvoiceAwaitingDispatch}`,
    });
    expect(button).toBeDisabled();
  });

  it("tells apart a part that will never be invoiced", () => {
    render(
      <SubOrderInvoicesList
        subOrders={[
          sub({ id: "so-2", status: "CANCELLED", taxInvoiceNumber: null }),
        ]}
        stateBySubOrder={{ "so-2": "notApplicable" }}
        invoicePending={false}
        pendingSubOrderId={null}
        onDownloadSubOrderInvoice={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", {
      name: `GlamourGoods · ${LABELS.taxInvoiceNotApplicable}`,
    });
    expect(button).toBeDisabled();
  });

  it("enables the download and shows the invoice number once issued", () => {
    const onDownload = vi.fn();
    render(
      <SubOrderInvoicesList
        subOrders={[
          sub({ id: "so-3", taxInvoiceNumber: "GLAM/2627/00000001" }),
        ]}
        stateBySubOrder={{ "so-3": "issued" }}
        invoicePending={false}
        pendingSubOrderId={null}
        onDownloadSubOrderInvoice={onDownload}
      />,
    );

    const button = screen.getByRole("button", {
      name: "GlamourGoods · GLAM/2627/00000001",
    });
    expect(button).toBeEnabled();
    button.click();
    expect(onDownload).toHaveBeenCalledWith("so-3");
  });
});
