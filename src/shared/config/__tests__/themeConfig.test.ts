import { describe, it } from "vitest";
import assert from "node:assert/strict";
import {
  DEFAULT_PALETTE_ID,
  THEME_PALETTES,
  getThemePalette,
  listThemePaletteIds,
  activeThemeConfig,
} from "@/shared/config/theme.config";

describe("theme config registry (Rule 29)", () => {
  it("registers palettes with unique ids", () => {
    const ids = THEME_PALETTES.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.length > 0);
  });

  it("every palette defines full light AND dark token sets with matching keys", () => {
    // Derive the token-key contract from the first palette's light mode.
    const reference = Object.keys(THEME_PALETTES[0]!.modes.light).sort();
    assert.ok(reference.includes("brand"));
    for (const palette of THEME_PALETTES) {
      for (const mode of ["light", "dark"] as const) {
        const tokens = palette.modes[mode] as unknown as Record<
          string,
          unknown
        >;
        assert.deepEqual(
          Object.keys(tokens).sort(),
          reference,
          `${palette.id}.${mode} token keys must match the contract`,
        );
        for (const key of reference) {
          assert.ok(
            typeof tokens[key] === "string" && tokens[key] !== "",
            `${palette.id}.${mode}.${key} must be a non-empty string`,
          );
        }
      }
    }
  });

  it("resolves the default palette and rejects unknown ids", () => {
    assert.ok(getThemePalette(DEFAULT_PALETTE_ID));
    assert.equal(getThemePalette("does-not-exist"), undefined);
    assert.ok(listThemePaletteIds().includes(DEFAULT_PALETTE_ID));
  });

  it("activeThemeConfig points at a registered palette", () => {
    assert.ok(getThemePalette(activeThemeConfig.paletteId));
  });
});
