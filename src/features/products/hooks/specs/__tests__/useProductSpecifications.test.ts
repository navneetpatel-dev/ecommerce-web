import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProductSpecifications } from "../useProductSpecifications.hook";
import { LABELS } from "@/shared/constants/labels";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";

describe("useProductSpecifications", () => {
  it("includes brand, vendor, specs, warranty, returns, and delivery info from admin/vendor", () => {
    const { result } = renderHook(() =>
      useProductSpecifications({
        specs: { "Bluetooth Version": "5.3", Color: "Midnight Black" },
        categoryName: "Audio",
        displayStock: 15,
        brand: "Sony",
        vendorName: "Apex Electronics",
        hsnCode: "85183000",
        warrantyMonths: 12,
        warrantyType: WARRANTY_TYPE.MANUFACTURER,
        returnsAllowed: true,
        returnWindowDays: 7,
        returnNote: "Original packaging required",
        deliveryNote: "Dispatches within 24 hours",
        codAvailable: true,
      }),
    );

    const rows = result.current.rows;
    const findRow = (label: string) => rows.find((r) => r.label === label);

    expect(findRow(LABELS.productBrand)?.value).toBe("Sony");
    expect(findRow(LABELS.soldBy)?.value).toBe("Apex Electronics");
    expect(findRow(LABELS.categoryLabel)?.value).toBe("Audio");
    expect(findRow("Bluetooth Version")?.value).toBe("5.3");
    expect(findRow("Color")?.value).toBe("Midnight Black");
    expect(findRow(LABELS.warranty)?.value).toContain("12-month");
    expect(findRow(LABELS.warranty)?.value).toContain(
      LABELS.warrantyManufacturer,
    );
    expect(findRow(LABELS.returnsPolicy)?.value).toContain(
      "7-day easy returns",
    );
    expect(findRow(LABELS.returnsPolicy)?.value).toContain(
      "Original packaging required",
    );
    expect(findRow(LABELS.deliveryAreaHeading)?.value).toBe(
      "Dispatches within 24 hours",
    );
    expect(findRow(LABELS.cashOnDelivery)?.value).toBe(LABELS.codAvailable);
    expect(findRow(LABELS.hsnCode)?.value).toBe("85183000");
  });
});
