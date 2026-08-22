import type { ColorModeTokens, ThemeConfig } from "@/shared/types/theme.types";

/**
 * Secondary palette presets (Rule 29 tier 2): muted botanical accent tier.
 * Full light + dark token sets per palette (Rule 29 parity).
 */

const ivorySageLight: ColorModeTokens = {
  brand: "#5F7355",
  brandHover: "#4A5C42",
  brandSubtle: "#E9EEE4",
  accent: "#A87F3B",
  accentSubtle: "#F6EDDD",
  ink: "#1A1D18",
  inkMuted: "#585D53",
  inkFaint: "#989C91",
  paper: "#F4F5EF",
  surface: "#FFFFFF",
  surfaceRaised: "#FCFDF9",
  line: "#D5DACB",
  lineStrong: "#BFC6B2",
  danger: "#9E3B33",
  dangerSubtle: "#F6E8E4",
  success: "#3E5C49",
  successSubtle: "#E5EEE7",
  warning: "#95610F",
  warningSubtle: "#FAEEDA",
  overlay: "rgba(26, 29, 24, 0.55)",
};

const ivorySageDark: ColorModeTokens = {
  brand: "#A9C29A",
  brandHover: "#BDD2AE",
  brandSubtle: "#222B1F",
  accent: "#D9B978",
  accentSubtle: "#302717",
  ink: "#F1F3EB",
  inkMuted: "#B5BAB0",
  inkFaint: "#7B7F76",
  paper: "#111310",
  surface: "#1B1E19",
  surfaceRaised: "#232720",
  line: "#555A50",
  lineStrong: "#6F7468",
  danger: "#E0685C",
  dangerSubtle: "#371F1C",
  success: "#93BCA0",
  successSubtle: "#1B2B21",
  warning: "#E2A63E",
  warningSubtle: "#332612",
  overlay: "rgba(0, 0, 0, 0.7)",
};

export const SECONDARY_PALETTES: ThemeConfig[] = [
  {
    id: "ivory-sage",
    label: "Ivory Sage",
    modes: { light: ivorySageLight, dark: ivorySageDark },
  },
];
