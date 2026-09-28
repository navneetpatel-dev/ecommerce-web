import { describe, expect, it } from "vitest";
import {
  ABOVE_TAB_BAR_CLASS,
  ABOVE_TAB_BAR_GAP_CLASS,
  CONTENT_CLEARANCE_CLASS,
  MOBILE_TAB_BAR_HEIGHT_CLASS,
} from "../mobileRails";
import { mobileTabBarStyles } from "@/shared/styles/layout/layout.styles";
import { toastStackStyles } from "@/shared/styles/notifications/toastStack.styles";

/**
 * `shared/` may not import from `features/` (Rule 15), so the rails that live in
 * features are covered by `scripts/check-safe-area-offsets.mjs` — it fails any
 * style module that hardcodes one of these offsets instead of using them.
 *
 * Every bottom rail measures from the tab bar's height: if the bar grows, the
 * offsets move with it.
 */
describe("mobile bottom rails", () => {
  it("defines the tab bar height once, at 3.5rem (min-h-14)", () => {
    expect(MOBILE_TAB_BAR_HEIGHT_CLASS).toBe("min-h-14");
    expect(mobileTabBarStyles.nav).toContain(MOBILE_TAB_BAR_HEIGHT_CLASS);
  });

  it("offsets toasts with a gap above the tab bar", () => {
    expect(toastStackStyles.viewport).toContain(ABOVE_TAB_BAR_GAP_CLASS);
  });

  it("carries the home-indicator inset in every offset it hands out", () => {
    for (const offset of [
      CONTENT_CLEARANCE_CLASS,
      ABOVE_TAB_BAR_CLASS,
      ABOVE_TAB_BAR_GAP_CLASS,
    ]) {
      expect(offset).toContain("env(safe-area-inset-bottom,0px)");
    }
  });

  it("keeps the clearance and offsets above the bar, not through it", () => {
    expect(CONTENT_CLEARANCE_CLASS).toContain("3.5rem");
    expect(ABOVE_TAB_BAR_CLASS).toContain("3.5rem");
    expect(ABOVE_TAB_BAR_GAP_CLASS).toContain("4rem");
  });
});
