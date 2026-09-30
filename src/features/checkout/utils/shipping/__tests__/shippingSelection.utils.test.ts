import { describe, expect, it } from "vitest";
import type { ShippingRate } from "@/shared/api/types";
import { resolveShippingSelectionStatus } from "../shippingSelection.utils";

function rate(method: "STANDARD" | "EXPRESS"): ShippingRate {
  return {
    method,
    cost: 59,
    shippingDisplayKey: "PAID",
    estimatedDays: 5,
  };
}

describe("resolveShippingSelectionStatus", () => {
  it("passes when every vendor has a rate for the method it picked", () => {
    const status = resolveShippingSelectionStatus(
      ["vendor-1", "vendor-2"],
      { "vendor-1": "STANDARD", "vendor-2": "EXPRESS" },
      {
        "vendor-1": [rate("STANDARD")],
        "vendor-2": [rate("STANDARD"), rate("EXPRESS")],
      },
    );

    expect(status).toEqual({
      isRateLookupPending: false,
      unservableVendorIds: [],
    });
  });

  it("flags a vendor with no rates at all for this delivery area", () => {
    const status = resolveShippingSelectionStatus(
      ["vendor-1"],
      { "vendor-1": "STANDARD" },
      { "vendor-1": [] },
    );

    expect(status.unservableVendorIds).toEqual(["vendor-1"]);
    expect(status.isRateLookupPending).toBe(false);
  });

  it("flags a vendor whose picked method is not served in this area", () => {
    // The store seeds STANDARD for every vendor; an EXPRESS-only area must not be quotable.
    const status = resolveShippingSelectionStatus(
      ["vendor-1"],
      { "vendor-1": "STANDARD" },
      { "vendor-1": [rate("EXPRESS")] },
    );

    expect(status.unservableVendorIds).toEqual(["vendor-1"]);
  });

  it("does not judge a vendor whose rates are still loading", () => {
    const status = resolveShippingSelectionStatus(
      ["vendor-1", "vendor-2"],
      { "vendor-1": "STANDARD", "vendor-2": "STANDARD" },
      { "vendor-1": [rate("STANDARD")], "vendor-2": undefined },
    );

    expect(status.isRateLookupPending).toBe(true);
    expect(status.unservableVendorIds).toEqual([]);
  });

  it("leaves the not-yet-picked case to the select-a-method hint", () => {
    const status = resolveShippingSelectionStatus(
      ["vendor-1"],
      {},
      { "vendor-1": [rate("STANDARD")] },
    );

    expect(status).toEqual({
      isRateLookupPending: false,
      unservableVendorIds: [],
    });
  });
});
