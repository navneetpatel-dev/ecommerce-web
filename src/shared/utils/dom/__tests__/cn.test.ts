import { describe, expect, it } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
  it("keeps a theme font size next to a text colour", () => {
    expect(cn("text-body-sm", "text-ink-muted")).toBe(
      "text-body-sm text-ink-muted",
    );
    expect(cn("text-body", "text-brand")).toBe("text-body text-brand");
  });

  it("still lets a later font size or colour win", () => {
    expect(
      cn("text-[0.875rem] sm:text-body", "text-body-sm sm:text-body-sm"),
    ).toBe("text-body-sm sm:text-body-sm");
    expect(cn("text-ink", "text-ink-muted")).toBe("text-ink-muted");
    expect(cn("text-body", "text-body-sm")).toBe("text-body-sm");
  });
});
