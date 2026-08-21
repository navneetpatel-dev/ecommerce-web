import { formatInr } from "@/shared/utils/orderFormat";
import { formatLabel } from "@/shared/utils/formatLabel";
import { LABELS } from "@/shared/constants/labels";

export function formatAnalyticsInr(value: number): string {
  return formatInr(value);
}

export function formatAnalyticsPercent(value: number): string {
  return formatLabel(LABELS.percentValue, { value: String(value) });
}

export function formatGrowthLabel(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatAnalyticsPercent(value)}`;
}

export function shortAnalyticsDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function fullAnalyticsDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type TrendPoint = { date: string; count: number; revenue?: number };

/** Fill missing calendar days so the trend chart stays evenly spaced. */
export function fillAnalyticsTrendDays(
  points: TrendPoint[],
  dayCount = 30,
): Array<{ date: string; count: number; revenue: number; label: string }> {
  const byDate = new Map(
    points.map((point) => [
      point.date,
      {
        date: point.date,
        count: Number(point.count ?? 0),
        revenue: Number(point.revenue ?? 0),
      },
    ]),
  );

  const end = new Date();
  end.setHours(12, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (dayCount - 1));

  const filled: Array<{
    date: string;
    count: number;
    revenue: number;
    label: string;
  }> = [];
  for (
    let cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const key = cursor.toISOString().slice(0, 10);
    const point = byDate.get(key) ?? { date: key, count: 0, revenue: 0 };
    filled.push({ ...point, label: shortAnalyticsDate(key) });
  }
  return filled;
}

/** Evenly spaced tick indexes for readable X-axis labels. */
export function pickTrendTickIndexes(length: number, maxTicks = 7): number[] {
  if (length <= 0) return [];
  if (length <= maxTicks) return Array.from({ length }, (_, index) => index);
  const last = length - 1;
  const indexes = new Set<number>([0, last]);
  for (let i = 1; i < maxTicks - 1; i += 1) {
    indexes.add(Math.round((i * last) / (maxTicks - 1)));
  }
  return [...indexes].sort((a, b) => a - b);
}
