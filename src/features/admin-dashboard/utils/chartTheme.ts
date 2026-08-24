import { useEffect, useState } from "react";
import {
  DEFAULT_PALETTE_ID,
  getThemePalette,
} from "@/shared/config/theme.config";
import type { ColorModeTokens } from "@/shared/types/theme.types";

export type ChartThemeColors = Pick<
  ColorModeTokens,
  | "brand"
  | "brandSubtle"
  | "ink"
  | "inkMuted"
  | "inkFaint"
  | "line"
  | "success"
  | "warning"
  | "danger"
  | "surface"
>;

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

function readChartColors(): ChartThemeColors {
  if (typeof window === "undefined") return FALLBACK;
  const s = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback;
  return {
    brand: read("--brand", FALLBACK.brand),
    brandSubtle: read("--brand-subtle", FALLBACK.brandSubtle),
    ink: read("--ink", FALLBACK.ink),
    inkMuted: read("--ink-muted", FALLBACK.inkMuted),
    inkFaint: read("--ink-faint", FALLBACK.inkFaint),
    line: read("--line", FALLBACK.line),
    success: read("--success", FALLBACK.success),
    warning: read("--warning", FALLBACK.warning),
    danger: read("--danger", FALLBACK.danger),
    surface: read("--surface", FALLBACK.surface),
  };
}

/** Resolve theme CSS variables for Recharts (SVG needs concrete colors). */
export function useChartThemeColors(): ChartThemeColors {
  const [colors, setColors] = useState<ChartThemeColors>(FALLBACK);

  useEffect(() => {
    setColors(readChartColors());

    const observer = new MutationObserver(() => setColors(readChartColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

export const STATUS_CHART_PALETTE = [
  "brand",
  "success",
  "warning",
  "danger",
  "inkMuted",
  "inkFaint",
] as const;
