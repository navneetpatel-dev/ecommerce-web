import { istDateString } from "@/shared/utils/formatting/istDate";

/**
 * Days the one-click export looks back. The reports engine rejects any range
 * wider than 366 days (REPORT_MAX_RANGE_DAYS) and counts `to` as running to the
 * end of that day, so 365 days back from today is the widest window it accepts.
 */
export const ORDER_HISTORY_EXPORT_DAYS = 365;

/** The last 12 months (IST days, today included) for the order-history export. */
export function defaultHistoryRange(now: Date = new Date()) {
  return {
    from: istDateString(now, ORDER_HISTORY_EXPORT_DAYS),
    to: istDateString(now),
  };
}
