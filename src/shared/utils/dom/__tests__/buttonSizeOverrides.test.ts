import { describe, expect, it } from "vitest";
import { dropSizeStepsOverridden } from "../buttonSizeOverrides";

const SIZE =
  "rounded-md px-4 text-[0.875rem] sm:px-5 sm:text-body [&_svg]:!size-4";

describe("dropSizeStepsOverridden", () => {
  it("keeps the size untouched when the caller sets neither", () => {
    expect(dropSizeStepsOverridden(SIZE, "w-full gap-2")).toBe(SIZE);
    expect(dropSizeStepsOverridden(SIZE, undefined)).toBe(SIZE);
  });

  it("drops the sm: padding step when the caller sets padding", () => {
    const out = dropSizeStepsOverridden(SIZE, "px-0 py-0 text-brand");
    expect(out).not.toContain("sm:px-5");
    expect(out).toContain("sm:text-body");
  });

  it("drops the sm: text step when the caller sets a font size", () => {
    const out = dropSizeStepsOverridden(SIZE, "h-8 px-3 text-body-sm");
    expect(out).not.toContain("sm:px-5");
    expect(out).not.toMatch(/sm:text-body(\s|$)/);
    expect(dropSizeStepsOverridden(SIZE, "text-[0.75rem]")).not.toMatch(
      /sm:text-body(\s|$)/,
    );
  });

  it("ignores colours and the caller's own breakpoint classes", () => {
    expect(dropSizeStepsOverridden(SIZE, "text-brand hover:text-ink")).toBe(
      SIZE,
    );
    expect(dropSizeStepsOverridden(SIZE, "px-2 sm:px-6")).toBe(SIZE);
    expect(dropSizeStepsOverridden(SIZE, "md:px-2")).toBe(SIZE);
  });
});
