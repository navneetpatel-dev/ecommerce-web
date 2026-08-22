"use client";

import { useThemePaletteContext } from "@/shared/context/ThemePalette.context";

interface UseThemePaletteResult {
  /** Active palette preset id (e.g. 'ink-brass'). */
  paletteId: string;
  /** Active color mode. Defaults to the stylesheet baseline pre-hydration. */
  mode: "light" | "dark";
  /** True once client preferences have been synchronized after mount. */
  mounted: boolean;
  setMode: (mode: "light" | "dark") => void;
  toggleMode: () => void;
  setPaletteId: (paletteId: string) => void;
}

/**
 * Public hook for reading and switching the centralized theme (Rule 29).
 * Must be used under `ThemePaletteProvider`.
 */
export function useThemePalette(): UseThemePaletteResult {
  const context = useThemePaletteContext();
  if (!context) {
    throw new Error(
      "useThemePalette must be used within a ThemePaletteProvider",
    );
  }
  return context;
}
