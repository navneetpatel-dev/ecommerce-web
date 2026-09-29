const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The India calendar date (YYYY-MM-DD) of a moment, `daysAgo` days back. Reports and
 * dashboards run on IST days, so a default range must not use the UTC date (which is
 * still yesterday before 05:30 IST).
 */
export function istDateString(moment: Date = new Date(), daysAgo = 0): string {
  return new Date(moment.getTime() + IST_OFFSET_MS - daysAgo * DAY_MS)
    .toISOString()
    .slice(0, 10);
}
