import { describe, expect, it } from "vitest";
import type { PincodeServiceability } from "@/shared/api/types";
import {
  deliveryEtaLabel,
  deliveryFreeShippingLabel,
  isDeliveryAreaBlocked,
  resolveDeliveryAreaStatus,
  UNKNOWN_DELIVERY_AREA,
} from "../deliveryArea";

function serviceability(
  partial: Partial<PincodeServiceability> = {},
): PincodeServiceability {
  return {
    pincode: "560001",
    serviceable: true,
    vendors: [],
    methods: ["STANDARD"],
    estimatedDays: { min: 2, max: 5 },
    freeShippingThreshold: 499,
    ...partial,
  };
}

function vendor(partial: {
  vendorId: string;
  serviceable?: boolean;
  freeShippingThreshold?: number | null;
  estimatedDays?: { min: number; max: number } | null;
}) {
  return {
    serviceable: true,
    methods: ["STANDARD"],
    estimatedDays: { min: 2, max: 5 },
    freeShippingThreshold: 499,
    ...partial,
  };
}

describe("resolveDeliveryAreaStatus", () => {
  it("is unknown until a check answers", () => {
    const status = resolveDeliveryAreaStatus(undefined);

    expect(status.known).toBe(false);
    expect(status.serviceable).toBe(false);
    expect(isDeliveryAreaBlocked({ ...UNKNOWN_DELIVERY_AREA, status })).toBe(
      false,
    );
  });

  it("names the vendors that don't serve the area", () => {
    const status = resolveDeliveryAreaStatus(
      serviceability({
        serviceable: false,
        vendors: [
          vendor({ vendorId: "vendor-1" }),
          vendor({ vendorId: "vendor-2", serviceable: false }),
        ],
      }),
    );

    expect(status.unserviceableVendorIds).toEqual(["vendor-2"]);
    expect(status.known).toBe(true);
    expect(status.serviceable).toBe(false);
  });

  it("keeps a per-vendor free-shipping promise only when every serving vendor agrees", () => {
    const agrees = resolveDeliveryAreaStatus(
      serviceability({
        vendors: [
          vendor({ vendorId: "vendor-1", freeShippingThreshold: 499 }),
          vendor({ vendorId: "vendor-2", freeShippingThreshold: 499 }),
        ],
      }),
    );
    const differs = resolveDeliveryAreaStatus(
      serviceability({
        vendors: [
          vendor({ vendorId: "vendor-1", freeShippingThreshold: 499 }),
          vendor({ vendorId: "vendor-2", freeShippingThreshold: 999 }),
        ],
      }),
    );

    expect(agrees.freeShippingThreshold).toBe(499);
    expect(differs.freeShippingThreshold).toBeNull();
  });
});

describe("isDeliveryAreaBlocked", () => {
  it("blocks only on a known no", () => {
    expect(
      isDeliveryAreaBlocked({
        pincode: "560001",
        status: resolveDeliveryAreaStatus(
          serviceability({ serviceable: false }),
        ),
        isChecking: false,
      }),
    ).toBe(true);

    expect(
      isDeliveryAreaBlocked({
        pincode: "560001",
        status: resolveDeliveryAreaStatus(serviceability()),
        isChecking: false,
      }),
    ).toBe(false);

    expect(isDeliveryAreaBlocked(undefined)).toBe(false);
  });
});

describe("delivery area copy", () => {
  it("reads one day differently from a range", () => {
    expect(deliveryEtaLabel("560001", { min: 3, max: 3 })).toBe(
      "Delivers to 560001 in 3 day(s)",
    );
    expect(deliveryEtaLabel("560001", { min: 2, max: 5 })).toBe(
      "Delivers to 560001 in 2–5 days",
    );
    expect(deliveryEtaLabel("560001", null)).toBeNull();
  });

  it("formats the free-shipping threshold, or stays silent without one", () => {
    expect(deliveryFreeShippingLabel(499)).toContain("499");
    expect(deliveryFreeShippingLabel(null)).toBeNull();
  });
});
