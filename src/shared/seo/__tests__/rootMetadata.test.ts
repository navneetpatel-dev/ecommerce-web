import { describe, expect, it } from "vitest";
import { ROOT_VIEWPORT, generateRootMetadata } from "../rootMetadata";

/**
 * `viewportFit: "cover"` is what makes every `env(safe-area-inset-*)` offset in
 * the tab bar, sheets, sticky bars, drawers and toasts resolve to a real value
 * on iOS. Without it they are all 0 — the regression this test locks down —
 * and content renders under the status bar and home indicator. Emulated
 * viewports hide it; only a real device (or this assertion) catches it.
 */
describe("ROOT_VIEWPORT", () => {
  it("opts into the full screen so safe-area insets have real values", () => {
    expect(ROOT_VIEWPORT.viewportFit).toBe("cover");
  });

  it("keeps the standard mobile viewport and theme colors", () => {
    expect(ROOT_VIEWPORT.width).toBe("device-width");
    expect(ROOT_VIEWPORT.initialScale).toBe(1);
    expect(ROOT_VIEWPORT.themeColor).toEqual([
      { media: "(prefers-color-scheme: light)", color: "#F6F3EC" },
      { media: "(prefers-color-scheme: dark)", color: "#121113" },
    ]);
  });
});

/**
 * The home-screen icon must be the file the icon script generates: iOS ignores
 * SVG, and an oversized/undersized raster gets scaled (or replaced by a page
 * screenshot when the link is missing).
 */
describe("root metadata icons", () => {
  it("points apple-touch-icon at the generated 180x180 PNG", () => {
    expect(appleIcons()).toEqual([
      { url: "/apple-icon.png", sizes: "180x180" },
    ]);
  });
});

/** `Metadata["icons"]` is a string | URL | array | object union; read the object arm. */
function appleIcons() {
  const { icons } = generateRootMetadata();
  if (
    !icons ||
    typeof icons !== "object" ||
    Array.isArray(icons) ||
    icons instanceof URL
  ) {
    return undefined;
  }
  return icons.apple;
}
