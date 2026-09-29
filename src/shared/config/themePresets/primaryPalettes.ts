import type { ColorModeTokens, ThemeConfig } from "@/shared/types/theme.types";
import { DARK_ELEVATION, LIGHT_ELEVATION } from "./baseTokens";

/**
 * Primary palette presets (Rule 29 tier 2). `inkBrass` is the product default
 * and mirrors the stylesheet baseline exactly; `emberNoir` is the alternate
 * primary-tier preset. Both define full light + dark token sets.
 */

const inkBrassLight: ColorModeTokens = {
  brand: "#8A6A2E",
  brandHover: "#6E5322",
  brandSubtle: "#F8F4E9",
  accent: "#A8432B",
  accentSubtle: "#F5E6E1",
  ink: "#1B1917",
  inkMuted: "#5C5750",
  inkFaint: "#6C6761",
  paper: "#F6F3EC",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  line: "#D8D1C2",
  // Control borders only need 3:1 (WCAG 1.4.11) — but that also means the
  // light palettes must darken theirs: a white input on a white card is
  // identified by its border alone.
  lineStrong: "#948C7D",
  danger: "#A13A32",
  dangerSubtle: "#F6E7E4",
  success: "#2C4A6B",
  successSubtle: "#E7ECF1",
  warning: "#9C5A12",
  warningSubtle: "#FBEEDD",
  overlay: "rgba(27, 25, 23, 0.55)",
};

const inkBrassDark: ColorModeTokens = {
  brand: "#D9B25E",
  brandHover: "#E8C476",
  brandSubtle: "#2E2717",
  accent: "#D2694A",
  accentSubtle: "#2C1C17",
  ink: "#F4F1EA",
  inkMuted: "#B7B1A8",
  // Readable tertiary text: the old value sat at 3.8:1 on raised dark
  // surfaces, below the 4.5:1 text minimum (and the 3:1 non-text minimum for
  // the faint icons that share this token).
  inkFaint: "#989186",
  paper: "#121113",
  surface: "#1C1B1D",
  surfaceRaised: "#242226",
  // Stronger lines so bordered controls keep visual weight vs light mode
  line: "#5A534C",
  lineStrong: "#746C63",
  danger: "#E2685C",
  dangerSubtle: "#39201D",
  success: "#7FA6C9",
  successSubtle: "#1C2A36",
  warning: "#E0902E",
  warningSubtle: "#362613",
  overlay: "rgba(0, 0, 0, 0.7)",
};

const emberNoirLight: ColorModeTokens = {
  brand: "#B1542C",
  brandHover: "#8F4223",
  brandSubtle: "#FAF3ED",
  accent: "#7A6A24",
  accentSubtle: "#F1EDD8",
  ink: "#1C1816",
  inkMuted: "#5F5651",
  inkFaint: "#6F6762",
  paper: "#F7F2EC",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFDFB",
  line: "#DCD2C6",
  lineStrong: "#968A7E",
  danger: "#A13A32",
  dangerSubtle: "#F6E7E4",
  success: "#33513F",
  successSubtle: "#E6EEE8",
  warning: "#96600F",
  warningSubtle: "#FAEFDB",
  overlay: "rgba(28, 24, 22, 0.55)",
};

const emberNoirDark: ColorModeTokens = {
  brand: "#E08B5B",
  brandHover: "#ECA274",
  brandSubtle: "#33201A",
  accent: "#CBB35A",
  accentSubtle: "#2C2614",
  ink: "#F5F0EB",
  inkMuted: "#BAB0A8",
  inkFaint: "#9A8F86",
  paper: "#131110",
  surface: "#1E1A18",
  surfaceRaised: "#272120",
  line: "#5C5049",
  lineStrong: "#776A60",
  danger: "#E2685C",
  dangerSubtle: "#38201C",
  success: "#88B79A",
  successSubtle: "#1B2C23",
  warning: "#E3A63C",
  warningSubtle: "#342712",
  overlay: "rgba(0, 0, 0, 0.7)",
};

export const PRIMARY_PALETTES: ThemeConfig[] = [
  {
    id: "ink-brass",
    label: "Ink & Brass",
    modes: { light: inkBrassLight, dark: inkBrassDark },
  },
  {
    id: "ember-noir",
    label: "Ember Noir",
    modes: { light: emberNoirLight, dark: emberNoirDark },
  },
];

/** Shared elevation ladders for palette files that need explicit access. */
export const PALETTE_ELEVATION = {
  light: LIGHT_ELEVATION,
  dark: DARK_ELEVATION,
} as const;
