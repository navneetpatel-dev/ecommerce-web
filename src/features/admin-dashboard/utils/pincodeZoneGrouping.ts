/**
 * Groups dispatch-picker rows by a coarse "zone" derived from the first 3
 * digits of an Indian 6-digit PIN code — a useful proxy for a delivery
 * agent's actual travel radius, much more useful for real dispatch than the
 * full 6-digit pincode. Rows with no pincode fall into a trailing "Unknown"
 * group so nothing silently disappears from the list.
 */

import { deliveryDispatchZoneLabels } from "@/shared/constants/labels/deliveryDispatchZones";

const ZONE_PREFIX_LENGTH = 3;
const UNKNOWN_ZONE = deliveryDispatchZoneLabels.unknownZone;

export function pincodeZoneOf(pincode: string | null | undefined): string {
  if (!pincode) return UNKNOWN_ZONE;
  const trimmed = pincode.trim();
  if (trimmed.length < ZONE_PREFIX_LENGTH) return UNKNOWN_ZONE;
  return trimmed.slice(0, ZONE_PREFIX_LENGTH);
}

export type PincodeZoneGroup<T> = {
  zone: string;
  rows: T[];
};

/**
 * Groups rows by pincode zone and sorts groups ascending by zone (numeric
 * where possible), with the "Unknown" group always last.
 */
export function groupByPincodeZone<T extends { pincode?: string | null }>(
  rows: T[],
): PincodeZoneGroup<T>[] {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const zone = pincodeZoneOf(row.pincode);
    const existing = groups.get(zone);
    if (existing) {
      existing.push(row);
    } else {
      groups.set(zone, [row]);
    }
  }

  return Array.from(groups.entries())
    .map(([zone, zoneRows]) => ({ zone, rows: zoneRows }))
    .sort((a, b) => {
      if (a.zone === UNKNOWN_ZONE) return 1;
      if (b.zone === UNKNOWN_ZONE) return -1;
      return a.zone.localeCompare(b.zone);
    });
}
