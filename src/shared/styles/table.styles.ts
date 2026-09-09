/**
 * Shared dashboard table presentation tokens (desktop tables + mobile cards).
 * Consolidates repeated patterns across admin and vendor data tables.
 */

/** Table section title / heading. */
export const TABLE_TITLE = "mb-4 text-[1.375rem] font-semibold text-ink";

/** Responsive mobile card list container (hidden on lg+ where table takes over). */
export const TABLE_CARD_MOBILE_LIST = "space-y-3 lg:hidden";

/** Mobile table-row card container. */
export const TABLE_CARD_MOBILE =
  "rounded-md border border-line bg-surface p-4 shadow-card-hairline";

/** Header row within a mobile card (e.g., date + status or ID + action). */
export const TABLE_CARD_MOBILE_HEADER =
  "flex items-start justify-between gap-3";

/** Empty state container for mobile table views. */
export const TABLE_CARD_MOBILE_EMPTY =
  "rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted";

/** Label for key-value items in mobile card layout. */
export const TABLE_CARD_MOBILE_LABEL =
  "text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted";

/** Interactive table row hover effect. */
export const TABLE_ROW_INTERACTIVE =
  "border-b border-line/60 hover:bg-paper/40 transition-colors";

/** Centered empty table cell for desktop tables. */
export const TABLE_CELL_EMPTY = "text-center text-ink-muted";
