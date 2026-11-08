import { describe, expect, it } from "vitest";
import {
  adminShipmentStatusBlocker,
  nextAdminShipmentStatuses,
} from "../adminShipmentStatus";

describe("nextAdminShipmentStatuses", () => {
  it("offers delivery, a failed attempt or RTO for a parcel out for delivery", () => {
    expect(nextAdminShipmentStatuses("OUT_FOR_DELIVERY")).toEqual([
      "DELIVERED",
      "FAILED",
      "RTO_INITIATED",
    ]);
  });

  it("only offers receiving a returning parcel back", () => {
    expect(nextAdminShipmentStatuses("RTO_INITIATED")).toEqual([
      "RTO_DELIVERED",
    ]);
  });

  it("offers nothing once a parcel is delivered or back, or has no status", () => {
    expect(nextAdminShipmentStatuses("DELIVERED")).toEqual([]);
    expect(nextAdminShipmentStatuses("RTO_DELIVERED")).toEqual([]);
    expect(nextAdminShipmentStatuses(null)).toEqual([]);
  });
});

describe("adminShipmentStatusBlocker", () => {
  it("needs a status and, for a failed attempt, a reason", () => {
    expect(adminShipmentStatusBlocker({ nextStatus: null, reason: "" })).toBe(
      "chooseStatus",
    );
    expect(
      adminShipmentStatusBlocker({ nextStatus: "FAILED", reason: "  " }),
    ).toBe("reasonRequired");
    expect(
      adminShipmentStatusBlocker({
        nextStatus: "FAILED",
        reason: "Door locked",
      }),
    ).toBeNull();
    expect(
      adminShipmentStatusBlocker({ nextStatus: "DELIVERED", reason: "" }),
    ).toBeNull();
  });
});
