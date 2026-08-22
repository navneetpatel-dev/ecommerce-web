"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ActiveThemeSelection,
  ColorModeTokens,
  ThemeConfig,
  ThemeMode,
} from "@/shared/types/theme.types";
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

function readStoredMode(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Storage unavailable (private mode / SSR guard) — fall back to system.
    return null;
  }
}

function readStoredPaletteId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME_PALETTE);
  } catch {
    // Storage unavailable — keep the default palette.
    return null;
  }
}

function resolveStoredSelection(): ActiveThemeSelection {
  const paletteId = readStoredPaletteId();
  const mode = readStoredMode();
  return {
    paletteId:
      paletteId && getThemePalette(paletteId)
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

/** Writes the resolved token set onto <html> as inline CSS custom properties. */
export function applyThemeToDocument(
  palette: ThemeConfig,
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

interface ThemePaletteContextValue extends ActiveThemeSelection {
  /** True once client preferences have been synchronized after mount. */
  mounted: boolean;
  /** Switch color mode; persists and re-resolves all tokens. */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark. */
  toggleMode: () => void;
  /** Switch palette preset; persists and re-resolves all tokens. */
  setPaletteId: (paletteId: string) => void;
}

const ThemePaletteContext = createContext<ThemePaletteContextValue | null>(
  null,
);

/**
 * Runtime theme synchronization (Rule 29): persists preferences, resolves
 * the active palette/mode into CSS custom properties on
 * `document.documentElement`, and follows the OS scheme until the user picks
 * a mode explicitly. Hydration-safe: SSR and first render always use the
 * stylesheet baseline (`activeThemeConfig`) before client storage is read.
 */
export function ThemePaletteProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<ActiveThemeSelection>(() => ({
    paletteId: activeThemeConfig.paletteId,
    mode: activeThemeConfig.mode,
  }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mount-time sync of persisted preferences: storage is client-only, so
    // the read must happen in an effect after hydration (Rule 29).
    const stored = resolveStoredSelection();
    setSelection(stored);
    setMounted(true);
    const palette = getThemePalette(stored.paletteId);
    if (palette) applyThemeToDocument(palette, stored.mode);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredMode()) return;
      const nextMode: ThemeMode = event.matches ? "dark" : "light";
      setSelection((current) => {
        const palette = getThemePalette(current.paletteId);
        if (palette) applyThemeToDocument(palette, nextMode);
        return { ...current, mode: nextMode };
      });
    };
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const persistAndApply = useCallback((next: ActiveThemeSelection) => {
    const palette = getThemePalette(next.paletteId);
    if (!palette) return;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, next.mode);
      localStorage.setItem(STORAGE_KEYS.THEME_PALETTE, next.paletteId);
    } catch {
      // Persistence is best-effort; the runtime switch still applies.
    }
    applyThemeToDocument(palette, next.mode);
    setSelection(next);
  }, []);

  const setMode = useCallback(
    (mode: ThemeMode) => {
      if (!getThemePalette(selection.paletteId)) return;
      persistAndApply({ ...selection, mode });
    },
    [persistAndApply, selection],
  );

  const toggleMode = useCallback(() => {
    const nextMode: ThemeMode = selection.mode === "light" ? "dark" : "light";
    if (!getThemePalette(selection.paletteId)) return;
    persistAndApply({ ...selection, mode: nextMode });
  }, [persistAndApply, selection]);

  const setPaletteId = useCallback(
    (paletteId: string) => {
      if (!getThemePalette(paletteId)) return;
      persistAndApply({ ...selection, paletteId });
    },
    [persistAndApply, selection],
  );

  const value = useMemo<ThemePaletteContextValue>(
    () => ({
      paletteId: selection.paletteId,
      mode: selection.mode,
      mounted,
      setMode,
      toggleMode,
      setPaletteId,
    }),
    [selection, mounted, setMode, toggleMode, setPaletteId],
  );

  return (
    <ThemePaletteContext.Provider value={value}>
      {children}
    </ThemePaletteContext.Provider>
  );
}

export function useThemePaletteContext(): ThemePaletteContextValue | null {
  return useContext(ThemePaletteContext);
}
