import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_PALETTE_ID,
  THEME_PALETTES,
  getThemePalette,
} from "@/shared/config/theme.config";
import type { ColorModeTokens } from "@/shared/types/theme.types";

/**
 * Colour contrast is a property of the palette data, so it is checked here
 * rather than by eye in a browser. Tier-4 manual passes (screen, zoom, real
 * device) still apply to layout — but every text/background pair the product
 * ships is verified by arithmetic on every run.
 */
const TEXT_PAIRS: ReadonlyArray<
  readonly [keyof ColorModeTokens, keyof ColorModeTokens, number, string]
> = [
  ["ink", "paper", 4.5, "body text on the page"],
  ["ink", "surface", 4.5, "body text on cards"],
  ["ink", "surfaceRaised", 4.5, "body text on raised cards"],
  ["inkMuted", "paper", 4.5, "secondary text on the page"],
  ["inkMuted", "surface", 4.5, "secondary text on cards"],
  ["inkMuted", "surfaceRaised", 4.5, "secondary text on raised cards"],
  // Placeholders, hints, captions, timestamps and empty states all use this
  // token, and the same colour strokes faint icons (3:1 non-text minimum).
  ["inkFaint", "paper", 4.5, "tertiary text on the page"],
  ["inkFaint", "surface", 4.5, "tertiary text on cards"],
  ["inkFaint", "surfaceRaised", 4.5, "tertiary text on raised cards"],
  ["inkFaint", "brandSubtle", 4.5, "tertiary text on a brand tint"],
  ["inkFaint", "accentSubtle", 4.5, "tertiary text on an accent tint"],
  ["inkFaint", "dangerSubtle", 4.5, "tertiary text on a danger tint"],
  ["inkFaint", "successSubtle", 4.5, "tertiary text on a success tint"],
  ["inkFaint", "warningSubtle", 4.5, "tertiary text on a warning tint"],
  ["brand", "paper", 4.5, "brand link text"],
  ["brand", "surface", 4.5, "brand link text on cards"],
  ["accent", "paper", 4.5, "accent text"],
  ["danger", "paper", 4.5, "error text"],
  ["danger", "surface", 4.5, "error text on cards"],
  ["success", "paper", 4.5, "success text"],
  ["warning", "paper", 4.5, "warning text"],
  // Tone-coloured badges: `<tone>` text on its own subtle tint.
  ["danger", "dangerSubtle", 4.5, "danger badge"],
  ["success", "successSubtle", 4.5, "success badge"],
  ["warning", "warningSubtle", 4.5, "warning badge"],
  ["brand", "brandSubtle", 4.5, "brand badge"],
  // DiscountBadge / image badge: `bg-accent-subtle text-accent`.
  ["accent", "accentSubtle", 4.5, "accent badge"],
  // Labels on solid tone backgrounds (buttons, filled badges).
  ["paper", "brand", 4.5, "primary button label"],
  ["paper", "danger", 4.5, "destructive button label"],
  ["paper", "accent", 4.5, "accent button label"],
];

/**
 * Non-text contrast (WCAG 1.4.11): the border is the only thing identifying a
 * control when its fill matches the surface behind it — a white input on a
 * white card — so it must reach 3:1. `line` is deliberately absent: it draws
 * decorative separators and card edges, which 1.4.11 exempts.
 */
const BORDER_PAIRS: ReadonlyArray<
  readonly [keyof ColorModeTokens, keyof ColorModeTokens, number, string]
> = [
  ["lineStrong", "paper", 3, "control border on the page"],
  ["lineStrong", "surface", 3, "control border on cards"],
  ["lineStrong", "surfaceRaised", 3, "control border on raised cards"],
];

/**
 * Pairs that are below AA today, with the ratio they must not drop below.
 * Every entry is a design decision (changing it moves brand identity or the
 * border language), so it is locked rather than silently rewritten: contrast
 * debt can shrink, never grow. Remove an entry once its palette is adjusted.
 */
const KNOWN_CONTRAST_DEBT: Record<string, number> = {};

const readCssTokens = (selector: string) => {
  const css = fs.readFileSync(
    path.resolve(process.cwd(), "src/shared/styles/globals.css"),
    "utf8",
  );
  const open = css.indexOf("{", css.indexOf(selector));
  const body = css.slice(open, css.indexOf("}", open));
  const tokens: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(
    /--([a-z-]+):\s*(#[0-9a-fA-F]+);/g,
  )) {
    tokens[name] = value.toLowerCase();
  }
  return tokens;
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

describe("theme contrast", () => {
  for (const palette of THEME_PALETTES) {
    for (const mode of ["light", "dark"] as const) {
      it(`${palette.id} (${mode}) meets WCAG AA for text`, () => {
        const tokens = palette.modes[mode];
        const failures: string[] = [];

        for (const [fg, bg, minimum, label] of TEXT_PAIRS) {
          const value = contrast(tokens[fg] as string, tokens[bg] as string);
          const debtKey = `${palette.id}:${mode}:${fg}-on-${bg}`;
          const floor = KNOWN_CONTRAST_DEBT[debtKey];

          if (floor === undefined) {
            if (value < minimum) {
              failures.push(
                `${label} — ${String(fg)} on ${String(bg)} is ${value.toFixed(2)}:1, needs ${minimum}:1`,
              );
            }
            continue;
          }

          if (value < floor - 0.01) {
            failures.push(
              `${label} — known contrast debt ${debtKey} got worse (${value.toFixed(2)}:1, was ${floor.toFixed(2)}:1)`,
            );
          }
        }

        expect(failures).toEqual([]);
      });
    }
  }

  for (const palette of THEME_PALETTES) {
    for (const mode of ["light", "dark"] as const) {
      it(`${palette.id} (${mode}) meets WCAG 1.4.11 for control borders`, () => {
        const tokens = palette.modes[mode];
        const failures = BORDER_PAIRS.flatMap(([fg, bg, minimum, label]) => {
          const value = contrast(tokens[fg] as string, tokens[bg] as string);
          return value < minimum
            ? [
                `${label} — ${String(fg)} on ${String(bg)} is ${value.toFixed(2)}:1, needs ${minimum}:1`,
              ]
            : [];
        });

        expect(failures).toEqual([]);
      });
    }
  }

  it("keeps every ink level ordered: ink > inkMuted > inkFaint", () => {
    for (const palette of THEME_PALETTES) {
      for (const mode of ["light", "dark"] as const) {
        const tokens = palette.modes[mode];
        const steps = [
          contrast(tokens.ink, tokens.paper),
          contrast(tokens.inkMuted, tokens.paper),
          contrast(tokens.inkFaint, tokens.paper),
        ];
        // Tertiary text must stay visibly quieter than secondary text, or the
        // three-level hierarchy collapses into one flat grey.
        expect(steps[0]).toBeGreaterThan(steps[1]);
        expect(steps[1]).toBeGreaterThan(steps[2]);
        expect(steps[1] - steps[2]).toBeGreaterThan(0.9);
      }
    }
  });

  it("keeps the stylesheet baseline identical to the default palette", () => {
    const palette = getThemePalette(DEFAULT_PALETTE_ID);
    expect(palette).toBeDefined();

    // Pre-hydration paint must match `activeThemeConfig`, so every colour
    // token exists in the stylesheet with the same value as the preset.
    const byMode = [
      [palette!.modes.light, readCssTokens(":root")],
      [palette!.modes.dark, readCssTokens('[data-theme="dark"]')],
    ] as const;

    for (const [tokens, cssTokens] of byMode) {
      for (const [name, value] of Object.entries(tokens)) {
        if (typeof value !== "string" || !value.startsWith("#")) continue;
        const cssName = name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        expect(cssTokens[cssName]).toBe(value.toLowerCase());
      }
    }
  });
});
