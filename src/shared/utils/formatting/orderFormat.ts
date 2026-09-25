import {
  MISSING_AMOUNT,
  toDisplayAmount,
  type DisplayAmountInput,
} from "./displayAmount";

/** Format INR for storefront display (Inter + tabular-nums — not mono). Missing → "—". */
export function formatInr(value: DisplayAmountInput) {
  const amount = toDisplayAmount(value);
  if (amount == null) return MISSING_AMOUNT;
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Plain grouped INR amount without the ₹ prefix (₹ is rendered by markup). Missing → "—". */
export function formatInrAmount(value: DisplayAmountInput) {
  const amount = toDisplayAmount(value);
  if (amount == null) return MISSING_AMOUNT;
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/** Always-2dp INR for finance/report tables where columns must align (₹1,250.50). Missing → "—". */
export function formatInrExact(value: DisplayAmountInput) {
  const amount = toDisplayAmount(value);
  if (amount == null) return MISSING_AMOUNT;
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Short INR for header pills (₹499, ₹12,500, ₹1.2L). Missing → "—". */
export function formatInrCompact(value: DisplayAmountInput) {
  const exact = toDisplayAmount(value);
  if (exact == null) return MISSING_AMOUNT;
  const amount = Math.round(exact);
  if (amount >= 10_000_000) {
    const crore = amount / 10_000_000;
    return `₹${trimCompact(crore, crore >= 10 ? 0 : 1)}Cr`;
  }
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    return `₹${trimCompact(lakh, lakh >= 10 ? 0 : 1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

function trimCompact(value: number, digits: number) {
  return value.toFixed(digits).replace(/\.0$/, "");
}

export function formatOrderDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shortOrderId(id: string) {
  return id.slice(0, 8);
}

export function countOrderItems(order: {
  subOrders?: Array<{ items?: unknown[] }>;
}) {
  return (order.subOrders ?? []).reduce(
    (sum, so) => sum + (so.items?.length ?? 0),
    0,
  );
}

export function orderItemSummary(order: {
  subOrders?: Array<{ items?: Array<{ productName?: string }> }>;
}) {
  const names = (order.subOrders ?? [])
    .flatMap((so) => so.items ?? [])
    .map((item) => item.productName)
    .filter(Boolean) as string[];

  if (names.length === 0) return "No items";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]} and ${names.length - 1} more`;
}
