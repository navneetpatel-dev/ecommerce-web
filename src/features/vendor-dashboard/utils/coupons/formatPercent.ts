/** Formats a 0–1 ratio as a rounded percentage; em dash for missing values. */
export function formatPercent(ratio: number | null | undefined): string {
  if (ratio == null) return "—";
  return `${Math.round(Number(ratio) * 100)}%`;
}
