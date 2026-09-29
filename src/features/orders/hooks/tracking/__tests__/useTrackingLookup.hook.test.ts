import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTrackingLookup } from "../useTrackingLookup.hook";

vi.mock("../../../api/tracking/shipping.api", () => ({
  shippingApi: { tracking: vi.fn(), reschedule: vi.fn() },
}));

import { shippingApi } from "../../../api/tracking/shipping.api";

const tracking = vi.mocked(shippingApi.tracking);

function resultWith(status: string) {
  return { status, trackingNumber: "TRK1" };
}

/** Looks a number up and lets the effect register its refresh interval. */
async function lookupTrackingNumber(
  hook: ReturnType<
    typeof renderHook<ReturnType<typeof useTrackingLookup>, unknown>
  >,
  number = "TRK1",
) {
  await act(async () => {
    hook.result.current.setTrackingNumber(number);
    await hook.result.current.lookup();
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  tracking.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

/**
 * A customer watching a parcel move should not have to re-submit the tracking
 * number to see the next scan — and the page must stop asking once the shipment
 * has settled.
 */
describe("useTrackingLookup refresh", () => {
  it("re-checks a moving shipment while the page is open", async () => {
    tracking.mockResolvedValue(resultWith("OUT_FOR_DELIVERY") as never);
    const hook = renderHook(() => useTrackingLookup());
    await lookupTrackingNumber(hook);
    expect(tracking).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });

    expect(tracking).toHaveBeenCalledTimes(2);
    expect(hook.result.current.result?.status).toBe("OUT_FOR_DELIVERY");
  });

  it("stops refreshing once the shipment is delivered", async () => {
    tracking.mockResolvedValue(resultWith("DELIVERED") as never);
    const hook = renderHook(() => useTrackingLookup());
    await lookupTrackingNumber(hook);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(180_000);
    });

    expect(tracking).toHaveBeenCalledTimes(1);
  });

  it("keeps the last good status when a refresh request fails", async () => {
    tracking.mockResolvedValueOnce(resultWith("IN_TRANSIT") as never);
    const hook = renderHook(() => useTrackingLookup());
    await lookupTrackingNumber(hook);

    tracking.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });

    expect(hook.result.current.result?.status).toBe("IN_TRANSIT");
    expect(hook.result.current.error).toBeNull();
  });
});
