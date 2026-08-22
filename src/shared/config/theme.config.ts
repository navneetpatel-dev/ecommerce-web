import type {
  ActiveThemeSelection,
  ThemeConfig,
} from "@/shared/types/theme.types";
import { PRIMARY_PALETTES } from "./themePresets/primaryPalettes";
import { SECONDARY_PALETTES } from "./themePresets/secondaryPalettes";
import { TERTIARY_PALETTES } from "./themePresets/tertiaryPalettes";

/**
 * Central theme orchestrator (Rule 29 tier 3). Adding or removing a theme
 * across the entire application requires editing only the structured preset
 * files in `themePresets/` and registering it in `THEME_PALETTES` here.
 * Components never hardcode colors — they reference semantic tokens that
 * resolve through this config at runtime.
 */

/** Central dictionary of every registered palette preset. */
export const THEME_PALETTES: readonly ThemeConfig[] = [
  ...PRIMARY_PALETTES,
  ...SECONDARY_PALETTES,
  ...TERTIARY_PALETTES,
];

export const DEFAULT_PALETTE_ID = "ink-brass";

/**
 * The active theme configuration shipped as baseline. During SSR and first
 * paint (before hydration) the stylesheet defaults must match these values
 * exactly so there is no flash; the runtime provider synchronizes stored
 * preferences after mount.
 */
export const activeThemeConfig: ActiveThemeSelection & {
  paletteId: string;
  mode: "light" | "dark";
} = {
  paletteId: DEFAULT_PALETTE_ID,
  mode: "light",
};

export function getThemePalette(paletteId: string): ThemeConfig | undefined {
  return THEME_PALETTES.find((palette) => palette.id === paletteId);
}

export function listThemePaletteIds(): string[] {
  return THEME_PALETTES.map((palette) => palette.id);
}
