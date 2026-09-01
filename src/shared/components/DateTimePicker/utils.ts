export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
export const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
export const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

/** Fixed locale — `undefined` differs between Node SSR and the browser and causes hydration mismatches. */
const DISPLAY_LOCALE = "en-IN";

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Accepts ISO datetime or `YYYY-MM-DD`. */
export function parseValue(value?: string | null): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    const next = new Date(y, m - 1, d);
    return Number.isNaN(next.getTime()) ? null : next;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toDateOnly(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toIso(date: Date) {
  return date.toISOString();
}

export function roundMinute(m: number) {
  const stepped = Math.round(m / 5) * 5;
  return Math.min(55, Math.max(0, stepped));
}

export function formatDisplay(date: Date, mode: "date" | "datetime") {
  if (mode === "date") {
    return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}
