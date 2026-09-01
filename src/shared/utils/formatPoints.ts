/** Format store points for display (1 point = ₹1 off at checkout). */
export function formatPoints(value: number) {
  const amount = Number(value || 0);
  return `${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} pts`;
}

/** Compact points for header badges (1.2K pts, 12.5K pts). */
export function formatPointsCompact(value: number) {
  const amount = Math.round(Number(value) || 0);
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${trimCompact(m, m >= 10 ? 0 : 1)}M pts`;
  }
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `${trimCompact(k, k >= 10 ? 0 : 1)}K pts`;
  }
  return `${amount.toLocaleString("en-IN")} pts`;
}

/** Compact points for header icon pills — no suffix, same footprint as cart counts. */
export function formatPointsHeaderBadge(value: number) {
  const amount = Math.round(Number(value) || 0);
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${trimCompact(m, m >= 10 ? 0 : 1)}M`;
  }
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `${trimCompact(k, k >= 10 ? 0 : 1)}K`;
  }
  return amount.toLocaleString("en-IN");
}

function trimCompact(value: number, digits: number) {
  return value.toFixed(digits).replace(/\.0$/, "");
}
