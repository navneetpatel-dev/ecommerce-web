import { describe, expect, it } from "vitest";
import type { SubOrder } from "@/shared/api/types";
import { resolveTaxInvoiceAvailability } from "../invoiceAvailability.utils";

function sub(overrides: Partial<SubOrder> & { id: string }): SubOrder {
  return {
    orderId: "order-1",
    vendorId: "vendor-1",
    vendor: {
      id: "vendor-1",
      businessName: "Seller",
      slug: "seller",
      logoUrl: null,
    },
    status: "SHIPPED",
    subtotal: 100,
    customerTotal: 118,
    items: [],
    ...overrides,
  } as SubOrder;
}

describe("resolveTaxInvoiceAvailability", () => {
  it("enables a part whose invoice number was issued at dispatch", () => {
    const availability = resolveTaxInvoiceAvailability([
      sub({ id: "so-1", taxInvoiceNumber: "CARE/2627/00000001" }),
    ]);

    expect(availability.stateBySubOrder["so-1"]).toBe("issued");
    expect(availability.hasDownloadableInvoice).toBe(true);
    expect(availability.allInvoicesDisabled).toBe(false);
    expect(availability.singleInvoiceDisabled).toBe(false);
  });

  it("marks an undelivered part awaiting dispatch and disables the download", () => {
    const availability = resolveTaxInvoiceAvailability([
      sub({ id: "so-1", status: "PENDING", taxInvoiceNumber: null }),
    ]);

    expect(availability.stateBySubOrder["so-1"]).toBe("awaitingDispatch");
    expect(availability.hasDownloadableInvoice).toBe(false);
    expect(availability.allInvoicesDisabled).toBe(true);
    expect(availability.singleInvoiceDisabled).toBe(true);
  });

  it("never expects an invoice for a cancelled or returned part", () => {
    const availability = resolveTaxInvoiceAvailability([
      sub({ id: "so-1", status: "CANCELLED" }),
      sub({ id: "so-2", status: "RETURNED" }),
    ]);

    expect(availability.stateBySubOrder).toEqual({
      "so-1": "notApplicable",
      "so-2": "notApplicable",
    });
  });

  it("enables the ZIP as soon as one part is invoiced (a cancelled sibling does not)", () => {
    const availability = resolveTaxInvoiceAvailability([
      sub({
        id: "so-1",
        status: "DELIVERED",
        taxInvoiceNumber: "CARE/2627/00000001",
      }),
      sub({ id: "so-2", status: "CANCELLED", taxInvoiceNumber: null }),
    ]);

    expect(availability.stateBySubOrder["so-1"]).toBe("issued");
    expect(availability.stateBySubOrder["so-2"]).toBe("notApplicable");
    expect(availability.allInvoicesDisabled).toBe(false);
  });

  it("has nothing to download for an order with no parts", () => {
    const availability = resolveTaxInvoiceAvailability([]);

    expect(availability.hasDownloadableInvoice).toBe(false);
    expect(availability.allInvoicesDisabled).toBe(true);
    expect(availability.singleInvoiceDisabled).toBe(true);
  });
});
