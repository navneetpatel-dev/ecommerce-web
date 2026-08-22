import type {
  ElevationTokens,
  MotionTokens,
  RadiusTokens,
  SpacingTokens,
  TypographyTokens,
} from "@/shared/types/theme.types";

/**
 * Base design tokens shared by every palette preset (Rule 29 tier 1).
 * Palettes only vary color; structure (type, spacing, radius, motion) is
 * constant so switching presets never shifts layout.
 */

export const BASE_TYPOGRAPHY: TypographyTokens = {
  displayLg: "clamp(2rem, 5vw + 1rem, 3.5rem)",
  displayMd: "clamp(1.75rem, 3vw + 0.75rem, 2.5rem)",
  // Fraunces only at ≥28px — floor display-sm at 1.75rem
  displaySm: "clamp(1.75rem, 2vw + 0.5rem, 1.75rem)",
  h1: "clamp(1.375rem, 3vw + 0.5rem, 1.75rem)",
  h2: "1.375rem",
  h3: "1.125rem",
  bodyLg: "1.0625rem",
  body: "0.9375rem",
  bodySm: "0.8125rem",
  label: "0.8125rem",
  mono: "0.8125rem",
  eyebrow: "0.75rem",
};

export const BASE_SPACING: SpacingTokens = {
  "0": "0",
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "8": "32px",
  "10": "40px",
  "12": "48px",
  "16": "64px",
  "20": "80px",
};

export const BASE_RADIUS: RadiusTokens = {
  sm: "4px",
  md: "8px",
  lg: "14px",
  full: "9999px",
  card: "14px",
  button: "8px",
  input: "8px",
};

export const BASE_MOTION: MotionTokens = {
  instant: "100ms",
  fast: "150ms",
  base: "200ms",
  moderate: "300ms",
  slow: "400ms",
};

/** Light-mode elevation: soft warm diffused shadows. */
export const LIGHT_ELEVATION: ElevationTokens = {
  level0: "none",
  level1: "0 1px 3px rgba(27, 25, 23, 0.05), 0 1px 2px rgba(27, 25, 23, 0.03)",
  level2: "0 6px 16px rgba(27, 25, 23, 0.07)",
  level3: "0 16px 40px rgba(27, 25, 23, 0.10)",
  level4: "0 28px 64px rgba(27, 25, 23, 0.14)",
};

/**
 * Dark-mode elevation: rely on surface lightness + border instead of shadow
 * (Rule 29 — no global brightness filters or inversion hacks).
 */
export const DARK_ELEVATION: ElevationTokens = {
  level0: "none",
  level1: "none",
  level2: "none",
  level3: "none",
  level4: "none",
};
