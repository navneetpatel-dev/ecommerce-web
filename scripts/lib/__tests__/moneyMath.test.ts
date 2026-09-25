import { describe, expect, it } from "vitest";
import {
  findMoneyArithmetic,
  findRawMoneyDisplay,
  findZeroFallbackFormat,
  isMoneyName,
} from "../moneyMath.mjs";

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
  it("catches Math.min/max/abs/round choosing or rounding an amount", () => {
    expect(
      flagged(`
        const a = Math.min(walletBalance, amountDue);
        const b = Math.max(0, grandTotal);
        const c = Math.round(row.taxAmount);
        const d = Math.abs(deposit.amount);
        const e = Math.floor(Number(order.totalAmount ?? 0));
      `),
    ).toEqual([
      "Math.min(walletBalance, amountDue)",
      "Math.max(0, grandTotal)",
      "Math.round(row.taxAmount)",
      "Math.abs(deposit.amount)",
      "Math.floor(Number(order.totalAmount ?? 0))",
    ]);
  });

  it("leaves Math on counts alone, including a row-count total", () => {
    expect(
      flagged(`
        const to = Math.min(page * limit, total);
        const end = Math.min(currentPage * pageSize, pagination.total);
        const pages = Math.max(1, totalPages);
        const pct = Math.round(ratio * 100);
      `),
    ).toEqual([]);
  });

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

describe("findRawMoneyDisplay", () => {
  function shown(code: string): string[] {
    return findRawMoneyDisplay(code, "probe.tsx").map(
      (finding: { text: string }) => finding.text,
    );
  }

  it("catches the hand-rolled ₹ display the app used to have", () => {
    expect(
      shown(`
        const a = \`₹\${payout.amount.toFixed(2)}\`;
        const b = <span>₹{summary.earningsToday.toFixed(0)}</span>;
        const c = <span>₹{order.totalAmount}</span>;
        const d = \`₹\${Number(option.cost)}\`;
        const e = <span>Earnings (₹{summary.perTaskEarning}/task)</span>;
      `),
    ).toEqual([
      "payout.amount.toFixed(2)",
      "summary.earningsToday.toFixed(0)",
      "order.totalAmount",
      "Number(option.cost)",
      "summary.perTaskEarning",
    ]);
  });

  it("allows the shared formatters and non-money toFixed", () => {
    expect(
      shown(`
        const a = <span>₹{formatInrAmount(order.totalAmount)}</span>;
        const b = formatInrExact(payout.amount);
        const c = <span>₹{grandTotalFormatted}</span>;
        const d = rating.toFixed(1);
        const e = \`\${(bytes / 1024).toFixed(1)} KB\`;
      `),
    ).toEqual([]);
  });
});

describe("findZeroFallbackFormat", () => {
  function zeroed(code: string): string[] {
    return findZeroFallbackFormat(code, "probe.tsx").map(
      (finding: { text: string }) => finding.text,
    );
  }

  it("catches a missing amount turned into ₹0 before formatting", () => {
    expect(
      zeroed(`
        const a = formatInr(summary?.monthRevenue ?? 0);
        const b = <dd>{formatInrAmount(Number(analytics.revenueImpact ?? 0))}</dd>;
        const c = formatPoints(row.purchasedPoints || 0);
        const d = formatAnalyticsInr(Number(entry.value ?? 0));
        const e = formatInr(Number(order.totalAmount));
      `),
    ).toEqual([
      "formatInr(summary?.monthRevenue ?? 0)",
      "formatInrAmount(Number(analytics.revenueImpact ?? 0))",
      "formatPoints(row.purchasedPoints || 0)",
      "formatAnalyticsInr(Number(entry.value ?? 0))",
      "formatInr(Number(order.totalAmount))",
    ]);
  });

  it("allows passing the value through, other fallbacks and non-money calls", () => {
    expect(
      zeroed(`
        const a = formatInr(summary?.monthRevenue);
        const b = formatInr(order.amountDue ?? order.totalAmount);
        const c = formatLabel(LABELS.count, { n: total ?? 0 });
        const d = (row.walletRefundAmount ?? 0) > 0 ? formatInr(row.walletRefundAmount) : null;
      `),
    ).toEqual([]);
  });
});
