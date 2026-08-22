import type { ColorModeTokens, ThemeConfig } from "@/shared/types/theme.types";

/**
 * Tertiary palette presets (Rule 29 tier 2): cool cobalt accent tier.
 * Full light + dark token sets per palette (Rule 29 parity).
 */

const cobaltSlateLight: ColorModeTokens = {
  brand: "#33549C",
  brandHover: "#28427C",
  brandSubtle: "#E5EAF6",
  accent: "#9A5B2E",
  accentSubtle: "#F4E8DE",
  ink: "#171A1F",
  inkMuted: "#52575F",
  inkFaint: "#90959D",
  paper: "#F3F4F6",
  surface: "#FFFFFF",
  surfaceRaised: "#FBFBFD",
  line: "#D2D6DC",
  lineStrong: "#BAC0C8",
  danger: "#A03434",
  dangerSubtle: "#F7E7E7",
  success: "#2F5560",
  successSubtle: "#E4EEF0",
  warning: "#8F600F",
  warningSubtle: "#F9EFDA",
  overlay: "rgba(23, 26, 31, 0.55)",
};

const cobaltSlateDark: ColorModeTokens = {
  brand: "#93AEED",
  brandHover: "#A9C0F4",
  brandSubtle: "#1C2438",
  accent: "#DCA36C",
  accentSubtle: "#302316",
  ink: "#EFF1F5",
  inkMuted: "#B2B7BF",
  inkFaint: "#787D86",
  paper: "#101216",
  surface: "#191B20",
  surfaceRaised: "#21242B",
  line: "#50555E",
  lineStrong: "#6A707A",
  danger: "#E46767",
  dangerSubtle: "#371E1E",
  success: "#8CB8C6",
  successSubtle: "#182B31",
  warning: "#E2A63E",
  warningSubtle: "#332612",
  overlay: "rgba(0, 0, 0, 0.7)",
};

export const TERTIARY_PALETTES: ThemeConfig[] = [
  {
    id: "cobalt-slate",
    label: "Cobalt Slate",
    modes: { light: cobaltSlateLight, dark: cobaltSlateDark },
  },
];
