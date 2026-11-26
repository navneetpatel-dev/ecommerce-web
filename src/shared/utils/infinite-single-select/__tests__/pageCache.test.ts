import { afterEach, describe, expect, it, vi } from "vitest";
import { createPageCache } from "../pageCache";

afterEach(() => vi.useRealTimers());

describe("page cache", () => {
  it("returns what was stored until it expires", () => {
    vi.useFakeTimers();
    const cache = createPageCache<string>(1000, 10);
    cache.set("a", "page");
    expect(cache.get("a")).toBe("page");
    vi.advanceTimersByTime(1001);
    expect(cache.get("a")).toBeNull();
  });

  it("never holds more than its limit: the oldest entry goes first", () => {
    const cache = createPageCache<number>(60_000, 2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.get("a")).toBeNull();
    expect([cache.get("b"), cache.get("c")]).toEqual([2, 3]);
  });
});
