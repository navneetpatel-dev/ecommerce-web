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
  ThemeMode,
} from "@/shared/types/theme.types";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import {
  activeThemeConfig,
  getThemePalette,
} from "@/shared/config/theme.config";
import {
  applyThemeToDocument,
  resolveStoredSelection,
} from "./themePaletteDom";

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

function persistPreferences(selection: ActiveThemeSelection) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, selection.mode);
    localStorage.setItem(STORAGE_KEYS.THEME_PALETTE, selection.paletteId);
  } catch {
    // Persistence is best-effort; the runtime switch still applies.
  }
}

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
      if (localStorage.getItem(STORAGE_KEYS.THEME_MODE)) return;
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
    persistPreferences(next);
    applyThemeToDocument(palette, next.mode);
    setSelection(next);
  }, []);

  const setMode = useCallback(
    (mode: ThemeMode) => persistAndApply({ ...selection, mode }),
    [persistAndApply, selection],
  );

  const toggleMode = useCallback(() => {
    const nextMode: ThemeMode = selection.mode === "light" ? "dark" : "light";
    persistAndApply({ ...selection, mode: nextMode });
  }, [persistAndApply, selection]);

  const setPaletteId = useCallback(
    (paletteId: string) => persistAndApply({ ...selection, paletteId }),
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
