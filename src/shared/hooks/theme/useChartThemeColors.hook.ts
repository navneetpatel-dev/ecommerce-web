"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_PALETTE_ID,
  getThemePalette,
} from "@/shared/config/theme.config";
import type { ChartThemeColors } from "@/shared/types/theme.types";

export type { ChartThemeColors };

/**
 * SSR-safe fallback derived from the active palette preset (Rule 29: no
 * hardcoded colors outside themePresets). Recharts SVG only renders after
 * hydration, so the baseline light tokens are never visually used server-side.
 */
const FALLBACK: ChartThemeColors = (() => {
  const light = getThemePalette(DEFAULT_PALETTE_ID)?.modes.light;
  return {
    brand: light?.brand ?? "",
    brandSubtle: light?.brandSubtle ?? "",
    ink: light?.ink ?? "",
    inkMuted: light?.inkMuted ?? "",
    inkFaint: light?.inkFaint ?? "",
    line: light?.line ?? "",
    success: light?.success ?? "",
    warning: light?.warning ?? "",
    danger: light?.danger ?? "",
    surface: light?.surface ?? "",
  };
})();

/** Ordered token -> CSS variable pairs: one source for reading + comparing. */
const CHART_TOKENS = [
  ["brand", "--brand"],
  ["brandSubtle", "--brand-subtle"],
  ["ink", "--ink"],
  ["inkMuted", "--ink-muted"],
  ["inkFaint", "--ink-faint"],
  ["line", "--line"],
  ["success", "--success"],
  ["warning", "--warning"],
  ["danger", "--danger"],
  ["surface", "--surface"],
] as const satisfies readonly (readonly [keyof ChartThemeColors, string])[];

/**
 * `useSyncExternalStore` schedules a re-render whenever `getSnapshot()` returns
 * a new reference, so the parsed tokens are memoized: while the CSS variables
 * are unchanged every read hands back the very same object and no update is
 * scheduled. Handing out a fresh object per read is what tripped React's
 * "The result of getSnapshot should be cached to avoid an infinite loop".
 */
let cachedColors: ChartThemeColors = FALLBACK;

function readChartColors(): ChartThemeColors {
  if (typeof window === "undefined") return FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  const next = { ...FALLBACK };
  for (const [token, cssVar] of CHART_TOKENS) {
    next[token] = styles.getPropertyValue(cssVar).trim() || FALLBACK[token];
  }
  const unchanged = CHART_TOKENS.every(
    ([token]) => next[token] === cachedColors[token],
  );
  if (unchanged) return cachedColors;
  cachedColors = next;
  return cachedColors;
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme", "style"],
  });
  return () => observer.disconnect();
}

/** Stable server snapshot: hydration paints the palette baseline, not refs. */
function getServerSnapshot(): ChartThemeColors {
  return FALLBACK;
}

/** Resolve theme CSS variables for Recharts (SVG needs concrete colors). */
export function useChartThemeColors(): ChartThemeColors {
  return useSyncExternalStore(subscribe, readChartColors, getServerSnapshot);
}
