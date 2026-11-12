import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useShare } from "../useShare.hook";

const originalClipboard = navigator.clipboard;

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: originalClipboard,
    configurable: true,
  });
  vi.restoreAllMocks();
});

function setClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

/** B-28: Share must always end in a copied link or a link to copy by hand. */
describe("useShare copyLink", () => {
  it("marks the link copied when the clipboard works", async () => {
    setClipboard(vi.fn().mockResolvedValue(undefined));
    const { result } = renderHook(() => useShare("/products/a", "A"));
    await act(() => result.current.copyLink());
    expect(result.current.copied).toBe(true);
    expect(result.current.copyFailed).toBe(false);
  });

  it("falls back to a selection copy when the clipboard is denied", async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    document.execCommand = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() => useShare("/products/a", "A"));
    await act(() => result.current.copyLink());
    expect(result.current.copied).toBe(true);
  });

  it("shows the link to copy by hand when every way fails", async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    document.execCommand = vi.fn().mockReturnValue(false);
    const { result } = renderHook(() => useShare("/products/a", "A"));
    await act(() => result.current.copyLink());
    expect(result.current.copied).toBe(false);
    expect(result.current.copyFailed).toBe(true);
    expect(result.current.resolvedUrl).toMatch(/\/products\/a$/);
  });
});
