/**
 * Copy for the pincode-zone grouping added to the admin bulk-dispatch picker
 * (unassigned shipments / return pickups). Not yet merged into the root
 * `LABELS` object — imported directly until a maintainer folds it in (see
 * task report "SHARED FILE CHANGES NEEDED"). Keep flat string keys so the
 * merge is a drop-in later.
 */
export const deliveryDispatchZoneLabels = {
  /** Interpolated via `formatLabel`, e.g. "Zone 110 · 4 waiting" */
  zoneGroupHeader: "Zone {zone} · {count} waiting",
  unknownZone: "Unknown",
} as const;
