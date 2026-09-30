/**
 * Shared hover fills — chosen by what an element sits on, not by eye.
 *
 * `hover:bg-paper` is the pattern these replace. It reads as a faint grey on a white card in
 * light mode, but `paper` is the *page* token: in every dark palette it is far darker than
 * `surface` (#121113 vs #1C1B1D), so the same class punched a hole in the panel it hovered —
 * the storefront nav's "Top Rated" link. Every fill here instead moves one step *lighter*
 * than the background it is painted on, in light and dark palettes alike, which is what the
 * navbar Categories button already did (`hover:bg-brand-subtle` on a panel) and what
 * `check-hover-consistency.mjs` now enforces.
 */

/** Fill for a control that sits on a panel — the Categories-button hover. */
export const HOVER_ON_SURFACE = "hover:bg-brand-subtle";

/** Softer fill for dense rows (table rows, list items, menu entries) on a panel. */
export const HOVER_ON_SURFACE_ROW = "hover:bg-brand-subtle/40";

/** Fill for a control that sits directly on the page background (`bg-paper`). */
export const HOVER_ON_PAPER = "hover:bg-surface-raised";

/** Overlay for controls on a brand/dark fill or media, where the label is already light. */
export const HOVER_ON_DARK = "hover:bg-paper/10";

/** Text clamp to pair with a fill when the resting label is muted (`text-ink-muted`). */
export const HOVER_TEXT_CLAMP = "hover:text-ink";
