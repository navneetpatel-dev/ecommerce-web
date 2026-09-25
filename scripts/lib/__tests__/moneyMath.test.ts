import { describe, expect, it } from "vitest";
import { findMoneyArithmetic, isMoneyName } from "../moneyMath.mjs";

function flagged(code: string): string[] {
  return findMoneyArithmetic(code, "probe.ts").map(
    (finding: { text: string }) => finding.text,
  );
}

describe("isMoneyName", () => {
  it.each([
    "total",
    "amount",
    "price",
    "fee",
    "tax",
    "shipping",
    "grandTotal",
    "codAmount",
    "tdsAmount",
    "priceAtAdd",
    "walletAmountUsed",
    "GIFT_CARD_MIN_AMOUNT_INR",
  ])("treats %s as money", (name) => {
    expect(isMoneyName(name)).toBe(true);
  });

  it.each([
    "totalPages",
    "itemCount",
    "amountLabel",
    "discountPercent",
    "priceText",
    "limit",
    "quantity",
    "stock",
  ])("does not treat %s as money", (name) => {
    expect(isMoneyName(name)).toBe(false);
  });
});

describe("findMoneyArithmetic", () => {
  it("catches the forms the old regex guard missed", () => {
    expect(
      flagged(`
        const a = grandTotal - x;
        const b = total - tax;
        const c = row.amount * qty;
        const d = subtotal - x;
        const e = shippingCost +
          giftWrapTotal;
        acc.taxAmount += g.tax;
        const f = Number(order.totalAmount ?? 0) - walletUsed;
        const g = items.reduce((sum, i) => sum + i.revenue, 0);
      `),
    ).toEqual([
      "grandTotal - x",
      "total - tax",
      "row.amount * qty",
      "subtotal - x",
      "shippingCost + giftWrapTotal",
      "acc.taxAmount += g.tax",
      "Number(order.totalAmount ?? 0) - walletUsed",
      "sum + i.revenue",
    ]);
  });

  it("reports a nested chain once, at its outermost expression", () => {
    expect(flagged("const m = total - tax - shipping + fee;")).toEqual([
      "total - tax - shipping + fee",
    ]);
  });

  it("ignores counts, pagination, comparisons, and string concatenation", () => {
    expect(
      flagged(`
        const from = (page - 1) * limit + 1;
        const n = items.reduce((sum, i) => sum + i.quantity, 0);
        const pages = totalPages - 1;
        const covered = amount >= minAmount;
        const label = "₹" + amount;
        const tpl = \`\${amount}\` + suffix;
      `),
    ).toEqual([]);
  });
});
