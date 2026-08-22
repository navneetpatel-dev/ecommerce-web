/**
 * Platform-agnostic theme token contracts (Rule 29 / Rule 6).
 * No web-only units or APIs: every value is a primitive so native
 * mobile/tablet apps can consume the same presets without translation.
 */

export type ThemeMode = "light" | "dark";

export type ThemePaletteId = string;

/** Semantic color tokens for a single color mode (light or dark). */
export interface ColorModeTokens {
  /** Brand primary + interactive states. */
  brand: string;
  brandHover: string;
  brandSubtle: string;
  /** Secondary signal accent. */
  accent: string;
  accentSubtle: string;
  /** Foreground text hierarchy (onSurface / onSurfaceVariant / faint). */
  ink: string;
  inkMuted: string;
  inkFaint: string;
  /** Background page + surface hierarchy. */
  paper: string;
  surface: string;
  surfaceRaised: string;
  /** Borders and separators. */
  line: string;
  lineStrong: string;
  /** Feedback colors. */
  danger: string;
  dangerSubtle: string;
  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  /** Scrim over content. */
  overlay: string;
}

/** Corner radius scale, shared across palettes. */
export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  full: string;
  card: string;
  button: string;
  input: string;
}

/** Typography size scale, shared across palettes. */
export interface TypographyTokens {
  displayLg: string;
  displayMd: string;
  displaySm: string;
  h1: string;
  h2: string;
  h3: string;
  bodyLg: string;
  body: string;
  bodySm: string;
  label: string;
  mono: string;
  eyebrow: string;
}

/** Spacing scale on an 8px grid, shared across palettes. */
export interface SpacingTokens {
  readonly [step: string]: string;
}

/** Elevation shadow ladder for one color mode. */
export interface ElevationTokens {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

/** Motion duration scale, shared across palettes. */
export interface MotionTokens {
  instant: string;
  fast: string;
  base: string;
  moderate: string;
  slow: string;
}

/**
 * A complete, switchable theme preset. Every palette must define full,
 * independent token sets for both `light` and `dark` modes (Rule 29 parity).
 */
export interface ThemeConfig {
  id: ThemePaletteId;
  label: string;
  modes: Record<ThemeMode, ColorModeTokens>;
}

/** Fully-resolved runtime selection: which preset, which mode. */
export interface ActiveThemeSelection {
  paletteId: ThemePaletteId;
  mode: ThemeMode;
}
