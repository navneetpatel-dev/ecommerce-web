import { describe, expect, it } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { taxDisplayLabel } from "@/shared/utils/taxDisplay";
import type { CheckoutQuote } from "@/shared/api/types";
import { quoteOrderTotals } from "../quoteTotals.utils";

const quote = {
  vendorBreakdowns: [],
  grandTotal: 1739,
  cashbackAmount: 0,
  walletBalance: 0,
  walletAmountToUse: 0,
  amountDue: 1739,
  appliedCoupon: null,
  orderTotals: {
    merchandiseSubtotal: 1500,
    shippingTotal: 50,
    shippingDisplayKey: "PAID",
    taxTotal: 189,
    cgst: 45,
    sgst: 45,
    igst: 99,
    discountTotal: 0,
    taxDisplayKey: "CGST_SGST",
  },
} satisfies CheckoutQuote;

describe("quoteOrderTotals", () => {
  it("reads server-provided order totals from the quote", () => {
    expect(quoteOrderTotals(quote)).toEqual(quote.orderTotals);
  });
});

describe("taxDisplayLabel", () => {
  it("maps server tax display keys to labels", () => {
    expect(taxDisplayLabel("IGST")).toBe(LABELS.taxIgst);
    expect(taxDisplayLabel("CGST_SGST")).toBe(LABELS.taxCgstSgst);
    expect(taxDisplayLabel("GST")).toBe(LABELS.taxGst);
  });
});
