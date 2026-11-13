import { describe, expect, it } from "vitest";
import {
  markPopNavigation,
  preserveScrollOnNextNavigation,
  recalledScroll,
  rememberScroll,
  takePopNavigation,
  takePreserveScroll,
} from "../scrollMemory";

describe("scroll memory", () => {
  it("remembers the position per page (path + query)", () => {
    rememberScroll("/products/tee?tab=reviews", 1840);
    rememberScroll("/products/tee", 320);
    expect(recalledScroll("/products/tee?tab=reviews")).toBe(1840);
    expect(recalledScroll("/products/tee")).toBe(320);
    expect(recalledScroll("/never-visited")).toBeNull();
  });

  it("treats the top of the page as nothing to restore", () => {
    rememberScroll("/orders", 0);
    expect(recalledScroll("/orders")).toBeNull();
  });

  it("hands out the Back/Forward and keep-scroll flags exactly once", () => {
    markPopNavigation();
    expect(takePopNavigation()).toBe(true);
    expect(takePopNavigation()).toBe(false);
    preserveScrollOnNextNavigation();
    expect(takePreserveScroll()).toBe(true);
    expect(takePreserveScroll()).toBe(false);
  });

  it("keeps only the most recent pages", () => {
    for (let i = 0; i < 80; i += 1) rememberScroll(`/p/${i}`, 100 + i);
    expect(recalledScroll("/p/0")).toBeNull();
    expect(recalledScroll("/p/79")).toBe(179);
  });
});
