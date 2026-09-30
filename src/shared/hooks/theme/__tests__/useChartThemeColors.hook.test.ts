import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_PALETTE_ID,
  getThemePalette,
} from "@/shared/config/theme.config";
import { useChartThemeColors } from "../useChartThemeColors.hook";

const LIGHT_TOKENS = getThemePalette(DEFAULT_PALETTE_ID)?.modes.light;

/** jsdom has no cascade, so the stylesheet is stubbed with a mutable map. */
function stubCssVariables(values: Record<string, string>) {
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    () =>
      ({
        getPropertyValue: (name: string) => values[name] ?? "",
      }) as unknown as CSSStyleDeclaration,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Recharts cannot paint CSS variables, so the chart components read concrete
 * colors through this hook. The snapshot must be referentially stable: a fresh
 * object per read made `useSyncExternalStore` re-render forever and crashed the
 * admin delivery performance chart.
 */
describe("useChartThemeColors", () => {
  it("resolves every chart token from the theme CSS variables", () => {
    stubCssVariables({
      "--brand": "#8A6A2E",
      "--brand-subtle": "#F8F4E9",
      "--ink": "#1B1917",
      "--ink-muted": "#5C5750",
      "--ink-faint": "#6C6761",
      "--line": "#D8D1C2",
      "--success": "#2C4A6B",
      "--warning": "#9C5A12",
      "--danger": "#A13A32",
      "--surface": "#FFFFFF",
    });

    const { result } = renderHook(() => useChartThemeColors());

    expect(result.current).toEqual({
      brand: "#8A6A2E",
      brandSubtle: "#F8F4E9",
      ink: "#1B1917",
      inkMuted: "#5C5750",
      inkFaint: "#6C6761",
      line: "#D8D1C2",
      success: "#2C4A6B",
      warning: "#9C5A12",
      danger: "#A13A32",
      surface: "#FFFFFF",
    });
  });

  it("returns the identical snapshot while the colors are unchanged", () => {
    stubCssVariables({ "--brand": "#8A6A2E", "--surface": "#FFFFFF" });

    const { result, rerender } = renderHook(() => useChartThemeColors());
    const first = result.current;

    rerender();
    rerender();

    expect(result.current).toBe(first);
  });

  it("falls back to the palette baseline when a variable is unset", () => {
    expect(LIGHT_TOKENS).toBeDefined();
    stubCssVariables({});

    const { result } = renderHook(() => useChartThemeColors());

    expect(result.current.brand).toBe(LIGHT_TOKENS?.brand);
    expect(result.current.surface).toBe(LIGHT_TOKENS?.surface);
  });

  it("publishes a new snapshot when the theme colors change", () => {
    const values = { "--brand": "#8A6A2E", "--surface": "#FFFFFF" };
    stubCssVariables(values);

    const { result, rerender } = renderHook(() => useChartThemeColors());
    const lightSnapshot = result.current;

    values["--brand"] = "#D9B25E";
    rerender();

    expect(result.current.brand).toBe("#D9B25E");
    expect(result.current).not.toBe(lightSnapshot);
  });
});
