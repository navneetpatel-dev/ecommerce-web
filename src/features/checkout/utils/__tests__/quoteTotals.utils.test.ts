import { describe, expect, it } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import type { CheckoutQuote } from "@/shared/api/types";
import { quoteOrderTotals, quoteTaxLabel } from "../quoteTotals.utils";

const quote = {
  vendorBreakdowns: [],
  grandTotal: 1739,
  orderTotals: {
    merchandiseSubtotal: 1500,
    shippingTotal: 50,
    taxTotal: 189,
    cgst: 45,
    sgst: 45,
    igst: 99,
    discountTotal: 0,
    taxDisplayKey: "CGST_SGST",
  },
} as CheckoutQuote;

describe("quoteOrderTotals", () => {
  it("reads server-provided order totals from the quote", () => {
    expect(quoteOrderTotals(quote)).toEqual(quote.orderTotals);
  });
});

describe("quoteTaxLabel", () => {
  it("maps server tax display keys to labels", () => {
    expect(quoteTaxLabel("IGST")).toBe(LABELS.taxIgst);
    expect(quoteTaxLabel("CGST_SGST")).toBe(LABELS.taxCgstSgst);
    expect(quoteTaxLabel("GST")).toBe(LABELS.taxGst);
  });
});
