import { cn } from "@/shared/utils/cn";

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

/** Standard horizontal space-between row (list rows, headers, toolbars). */
export const ROW_BETWEEN = "flex items-center justify-between";

/** Section/heading text preset. */
export const HEADING_PRESET = "font-semibold tracking-tight text-ink";

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
