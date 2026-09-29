import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "../sitemap";

/**
 * The sitemap must not claim freshness it cannot know: `new Date()` is the
 * build time, and stamping every URL with it teaches crawlers to ignore
 * `lastModified`. This test exists to make reintroducing it a deliberate act.
 */
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sitemap", () => {
  it("lists the static routes without a fabricated lastModified", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("no backend in tests");
      }),
    );

    const entries = await sitemap();

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
    expect(entries.every((entry) => entry.url.startsWith("http"))).toBe(true);
  });
});
