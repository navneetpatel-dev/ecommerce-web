import { cn } from "@/shared/utils/dom/cn";

/**
 * Shared, reusable Tailwind class groups (Rule 5). Patterns that repeat across
 * many components are named once here and referenced by name — never retyped
 * inline. Compose with `cn()` when combining groups with component-specific
 * classes.
 */

/** Bordered surface panel (the standard card body treatment). */
export const PANEL_SURFACE = "border border-line bg-surface";

/** Elevated bordered panel (raised surface variant). */
export const PANEL_SURFACE_RAISED = "border border-line bg-surface-raised";

/** Elevated bordered panel with standard soft elevation shadow. */
export const PANEL_ELEVATED =
  "border border-line bg-surface shadow-elevation-1";

/** Card or panel header with subtle background. */
export const PANEL_HEADER =
  "border-b border-line bg-paper/55 px-5 py-4 md:px-6";

/** Compact panel header. */
export const PANEL_HEADER_COMPACT =
  "border-b border-line bg-paper/55 px-5 py-3.5";

/** Centered empty state panel. */
export const PANEL_EMPTY_STATE =
  "border border-line bg-surface-raised px-5 py-10 text-center";

/** Dashed border shell (dropzone / placeholder). */
export const PANEL_DASHED = "border border-dashed border-line bg-paper/50";

/** Standard horizontal space-between row (list rows, headers, toolbars). */
export const ROW_BETWEEN = "flex items-center justify-between";

/** Centered row with 8px (gap-2) spacing. */
export const FLEX_CENTER_GAP_2 = "flex items-center gap-2";

/** Centered row with 12px (gap-3) spacing. */
export const FLEX_CENTER_GAP_3 = "flex items-center gap-3";

/** Space-between row with 16px (gap-4) spacing. */
export const FLEX_BETWEEN_GAP_4 = "flex items-center justify-between gap-4";

/** Space-between row with 8px (gap-2) spacing. */
export const FLEX_BETWEEN_GAP_2 = "flex items-center justify-between gap-2";

/** Min-width zero flex-1 container for text truncation in flex rows. */
export const MIN_W_ZERO_FLEX_1 = "min-w-0 flex-1";

/** Section/heading text preset. */
export const HEADING_PRESET = "font-semibold tracking-tight text-ink";

/** Subheading / card title preset. */
export const TEXT_H2_HEADING = "text-[1.375rem] font-semibold text-ink";

/** Smaller section heading. */
export const TEXT_H3_SUBHEADING =
  "font-display text-[1.125rem] font-semibold text-ink";

/** Large display heading. */
export const TEXT_H1_DISPLAY =
  "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl";

/** Primary ink medium weight text. */
export const TEXT_INK_MEDIUM = "font-medium text-ink";

/** Small muted body text (most repeated typography token). */
export const TEXT_MUTED_SM = "text-body-sm text-ink-muted";

/** Base muted body text. */
export const TEXT_MUTED = "text-body text-ink-muted";

/** Small error / danger text. */
export const TEXT_DANGER_SM = "text-body-sm text-danger";

/** Small success text. */
export const TEXT_SUCCESS_SM = "text-body-sm text-success";

/** Monospace / tabular numbers for currency and data readouts. */
export const TEXT_NUM_MONO = "tabular-nums text-ink";

/** Medium tabular numbers. */
export const TEXT_NUM_MONO_MEDIUM = "tabular-nums font-medium";

/** Form field helper/description text. */
export const FORM_FIELD_DESC = "mt-1 text-body-sm text-ink-muted";

/** Form field validation error text. */
export const FORM_FIELD_ERROR = "mt-1 text-body-sm text-danger";

/** Standard 2-column responsive form grid. */
export const FORM_GRID_2COL = "grid gap-4 sm:grid-cols-2";

/** Storefront page container with vertical padding. */
export const STOREFRONT_PAGE_WRAPPER = "storefront-container py-8 md:py-10";

/** Compact storefront page container. */
export const STOREFRONT_PAGE_WRAPPER_COMPACT =
  "storefront-container relative py-6 md:py-8";

/** Top ambient radial glow background. */
export const HERO_RADIAL_BG =
  "pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_14%,transparent),transparent_60%)]";

/** Split layout with main column and sticky aside. */
export const STOREFRONT_SPLIT_LAYOUT =
  "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10";
export const STOREFRONT_SPLIT_MAIN = "min-w-0 lg:col-span-7 xl:col-span-8";
export const STOREFRONT_SPLIT_ASIDE =
  "relative hidden lg:col-span-5 lg:block xl:col-span-4";

/**
 * Eyebrow label tracking preset — the repeated uppercase tracking fragment.
 * Pair with a size (`text-body-sm`…) and color (`text-ink-muted`…) class.
 */
export const EYEBROW_TRACKING = "font-semibold uppercase tracking-[0.08em]";

/** Empty/loading-state centered column. */
export const STATE_STACK_CENTER =
  "px-5 py-10 flex flex-col items-center justify-center gap-2 text-center";

/** Composes the eyebrow preset with size and color utilities. */
export function eyebrowText(size: string, color: string): string {
  return cn(EYEBROW_TRACKING, size, color);
}
