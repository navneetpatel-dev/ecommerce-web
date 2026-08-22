import type { ColorModeTokens, ThemeMode } from "@/shared/types/theme.types";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import {
  activeThemeConfig,
  getThemePalette,
} from "@/shared/config/theme.config";

/**
 * CSS custom property names for every color token, in application order.
 * Names mirror the stylesheet baseline in globals.css so inline overrides
 * (set here) win over the :root / [data-theme] defaults after hydration.
 */
const COLOR_VAR_NAMES: readonly (keyof ColorModeTokens)[] = [
  "brand",
  "brandHover",
  "brandSubtle",
  "accent",
  "accentSubtle",
  "ink",
  "inkMuted",
  "inkFaint",
  "paper",
  "surface",
  "surfaceRaised",
  "line",
  "lineStrong",
  "danger",
  "dangerSubtle",
  "success",
  "successSubtle",
  "warning",
  "warningSubtle",
  "overlay",
];

function kebab(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function readStoredMode(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Storage unavailable (private mode / SSR guard) — fall back to system.
    return null;
  }
}

export function readStoredPaletteId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME_PALETTE);
  } catch {
    // Storage unavailable — keep the default palette.
    return null;
  }
}

/** Writes the resolved token set onto <html> as inline CSS custom properties. */
export function applyThemeToDocument(
  palette: { modes: Record<ThemeMode, ColorModeTokens> },
  mode: ThemeMode,
): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const tokens = palette.modes[mode];
  COLOR_VAR_NAMES.forEach((name) => {
    root.style.setProperty(`--${kebab(name)}`, tokens[name]);
  });
  root.setAttribute("data-theme", mode);
}

/** Resolves stored preferences (falling back to system/default). */
export function resolveStoredSelection(): {
  paletteId: string;
  mode: ThemeMode;
} {
  const paletteId = readStoredPaletteId();
  const mode = readStoredMode();
  return {
    paletteId:
      paletteId && Boolean(getThemePalette(paletteId))
        ? paletteId
        : activeThemeConfig.paletteId,
    mode:
      mode ??
      (typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : activeThemeConfig.mode),
  };
}
