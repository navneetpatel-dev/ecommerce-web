import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOnlineStatus } from "../useOnlineStatus.hook";

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

afterEach(() => {
  setOnline(true);
  vi.restoreAllMocks();
});

/**
 * The storefront banner depends on this: a persisted query cache will happily
 * render yesterday's prices, so the user has to be told the connection is gone
 * — and told again when it returns.
 */
describe("useOnlineStatus", () => {
  it("reports the browser's connection state", () => {
    setOnline(true);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    setOnline(false);
    const { result: offline } = renderHook(() => useOnlineStatus());
    expect(offline.current).toBe(false);
  });

  it("updates when the browser fires the offline and online events", () => {
    setOnline(true);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      setOnline(false);
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current).toBe(false);

    act(() => {
      setOnline(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current).toBe(true);
  });
});
