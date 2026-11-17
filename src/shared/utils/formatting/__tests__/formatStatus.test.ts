import { describe, it, expect } from "vitest";
import { formatStatusLabel } from "../formatStatus";

describe("formatStatusLabel", () => {
  it("formats single-word statuses", () => {
    expect(formatStatusLabel("APPROVED")).toBe("Approved");
    expect(formatStatusLabel("PENDING")).toBe("Pending");
    expect(formatStatusLabel("FAILED")).toBe("Failed");
  });

  it("formats multi-word underscore-separated statuses", () => {
    expect(formatStatusLabel("PENDING_APPROVAL")).toBe("Pending Approval");
    expect(formatStatusLabel("OUT_FOR_DELIVERY")).toBe("Out For Delivery");
    expect(formatStatusLabel("PICKUP_SCHEDULED")).toBe("Pickup Scheduled");
  });

  it("handles empty or falsy inputs safely", () => {
    expect(formatStatusLabel("")).toBe("");
  });
});
