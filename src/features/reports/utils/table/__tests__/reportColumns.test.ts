import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { reportColumnHeader, visibleReportColumns } from "../reportColumns";

describe("U24 + U25: report headers", () => {
  it("uses the server's label, never a raw key", () => {
    assert.equal(
      reportColumnHeader({
        key: "vendorFreeShippingCost",
        labelKey: "vendorFreeShippingCost",
        label: "Free-shipping cost (vendor)",
      }),
      "Free-shipping cost (vendor)",
    );
  });
  it("hides the raw vendor ID next to the vendor's name", () => {
    const keys = visibleReportColumns([
      { key: "vendorId", labelKey: "vendorId" },
      { key: "vendorName", labelKey: "vendorName" },
      { key: "platformCouponCost", labelKey: "platformCouponCost" },
    ]).map((column) => column.key);
    assert.deepEqual(keys, ["vendorName", "platformCouponCost"]);
  });
});
