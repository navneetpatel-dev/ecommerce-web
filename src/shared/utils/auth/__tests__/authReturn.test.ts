import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAuthReturnScroll,
  peekAuthReturnScroll,
  rememberAuthReturnScroll,
  safeReturnPath,
} from "../authReturn";

describe("safeReturnPath", () => {
  it("keeps app-relative paths and rejects anything that leaves the site", () => {
    expect(safeReturnPath("/wallet?tab=1")).toBe("/wallet?tab=1");
    expect(safeReturnPath("//evil.example")).toBeNull();
    expect(safeReturnPath("https://evil.example")).toBeNull();
    expect(safeReturnPath(null)).toBeNull();
  });
});

describe("auth return scroll", () => {
  beforeEach(() => {
    clearAuthReturnScroll();
  });

  it("remembers the offset for the page it was taken on, whatever the query encoding", () => {
    Object.defineProperty(window, "scrollY", {
      value: 1240,
      configurable: true,
    });
    rememberAuthReturnScroll("/products/tee?q=red%20shoes");
    expect(peekAuthReturnScroll("/products/tee?q=red+shoes")).toBe(1240);
    expect(peekAuthReturnScroll("/products/other")).toBeNull();
  });

  it("is cleared once applied", () => {
    Object.defineProperty(window, "scrollY", {
      value: 300,
      configurable: true,
    });
    rememberAuthReturnScroll("/wallet");
    clearAuthReturnScroll();
    expect(peekAuthReturnScroll("/wallet")).toBeNull();
  });
});
