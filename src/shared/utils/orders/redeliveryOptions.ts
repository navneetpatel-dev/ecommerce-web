import { LABELS } from "@/shared/constants/labels";

/** The windows the API accepts (B-45). */
export type RedeliveryWindow = "MORNING" | "AFTERNOON" | "EVENING";

export interface RedeliveryChoice {
  /** YYYY-MM-DD, an Indian calendar day. */
  date: string;
  window: RedeliveryWindow;
}

export interface RedeliveryOption<T extends string> {
  value: T;
  label: string;
}

/** Furthest day ahead the API accepts. */
export const MAX_REDELIVERY_DAYS_AHEAD = 14;
const INDIA_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_LABEL = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Asia/Kolkata",
});

export const REDELIVERY_WINDOW_OPTIONS: RedeliveryOption<RedeliveryWindow>[] = [
  { value: "MORNING", label: LABELS.redeliveryMorning },
  { value: "AFTERNOON", label: LABELS.redeliveryAfternoon },
  { value: "EVENING", label: LABELS.redeliveryEvening },
];

/** India's calendar date `plusDays` from now, as YYYY-MM-DD (deliveries run on Indian days). */
function indiaDate(now: Date, plusDays: number): string {
  return new Date(now.getTime() + INDIA_OFFSET_MS + plusDays * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

/** Tomorrow to 14 days ahead in India, labelled like "Thu, 12 Nov". */
export function redeliveryDayOptions(
  now = new Date(),
): RedeliveryOption<string>[] {
  return Array.from({ length: MAX_REDELIVERY_DAYS_AHEAD }, (_, index) => {
    const date = indiaDate(now, index + 1);
    const label = DAY_LABEL.format(new Date(`${date}T12:00:00+05:30`));
    return { value: date, label };
  });
}
