import {
  MISSING_AMOUNT,
  toDisplayAmount,
  type DisplayAmountInput,
} from "./displayAmount";

function trimTrailingZeros(value: string) {
  return value.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

/** Format a value ≥ 1,000 as K with up to 2 decimal places (2,022 → 2.02K, 10,000 → 10K). */
function formatPointsInK(amount: number, suffix = "") {
  const k = amount / 1_000;
  if (Number.isInteger(k)) return `${k}K${suffix}`;
  return `${trimTrailingZeros(k.toFixed(2))}K${suffix}`;
}

/** Format store points for display (1 point = ₹1 off at checkout). */
export function formatPoints(value: DisplayAmountInput) {
  const amount = toDisplayAmount(value);
  if (amount == null) return MISSING_AMOUNT;
  return `${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} pts`;
}

/** Compact points for header badges (2.02K pts, 10K pts). */
export function formatPointsCompact(value: DisplayAmountInput) {
  const exact = toDisplayAmount(value);
  if (exact == null) return MISSING_AMOUNT;
  const amount = Math.round(exact);
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    if (Number.isInteger(m)) return `${m}M pts`;
    return `${trimTrailingZeros(m.toFixed(2))}M pts`;
  }
  if (amount >= 1_000) {
    return formatPointsInK(amount, " pts");
  }
  return `${amount.toLocaleString("en-IN")} pts`;
}

/** Compact K notation for header icon pills (2,022 → 2.02K, 10,000 → 10K). */
export function formatPointsHeaderBadge(value: DisplayAmountInput) {
  const exact = toDisplayAmount(value);
  if (exact == null) return MISSING_AMOUNT;
  const amount = Math.round(exact);
  if (amount === 0) return "0";
  if (amount < 1_000) return amount.toLocaleString("en-IN");
  return formatPointsInK(amount);
}
