import { istDateString } from "@/shared/utils/formatting/istDate";

/** Default 2-year lookback window for the customer order-history export. */
export function defaultHistoryRange() {
  const to = new Date();
  const from = new Date();
  from.setFullYear(to.getFullYear() - 2);
  return {
    from: istDateString(from),
    to: istDateString(to),
  };
}
