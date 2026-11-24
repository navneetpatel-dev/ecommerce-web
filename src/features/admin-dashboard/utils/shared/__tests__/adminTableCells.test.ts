import { describe, expect, it } from "vitest";
import type { AdminDataRow } from "../../../hooks/shared/useAdminDataList.hook";
import {
  adminCellText,
  formatAdminCellValue,
  getAdminCellValue,
  shouldInferAdminColumn,
} from "../adminTableCells";

describe("adminTableCells adversarial and boundary tests", () => {
  it("getAdminCellValue handles null/undefined row and missing paths safely", () => {
    expect(
      getAdminCellValue(null as unknown as AdminDataRow, "name"),
    ).toBeUndefined();
    expect(
      getAdminCellValue(undefined as unknown as AdminDataRow, "name"),
    ).toBeUndefined();
    expect(getAdminCellValue({}, "nonexistent")).toBeUndefined();
    expect(getAdminCellValue({}, "nested.deep.path")).toBeUndefined();
    expect(
      getAdminCellValue({ nested: null }, "nested.deep.path"),
    ).toBeUndefined();
    expect(
      getAdminCellValue(
        { nested: { deep: { path: "found" } } },
        "nested.deep.path",
      ),
    ).toBe("found");
  });

  it("adminCellText handles null/undefined row safely", () => {
    expect(adminCellText(null as unknown as AdminDataRow, "name")).toBe("—");
    expect(adminCellText(undefined as unknown as AdminDataRow, "name")).toBe(
      "—",
    );
    expect(adminCellText({}, "name")).toBe("—");
  });

  it("adminCellText suppresses raw UUIDs on id column and resolves candidate human names", () => {
    const rowWithUuid = {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Acme Corp",
    };
    expect(adminCellText(rowWithUuid, "id")).toBe("Acme Corp");

    const rowWithOnlyUuid = {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    };
    expect(adminCellText(rowWithOnlyUuid, "id")).toBe("—");
  });

  it("adminCellText resolves candidate names for *Id columns", () => {
    const row = {
      vendorId: "vendor-uuid-1234",
      vendorName: "Super Seller",
    };
    expect(adminCellText(row, "vendorId")).toBe("Super Seller");
  });

  it("formatAdminCellValue replaces bare UUIDs with —", () => {
    expect(formatAdminCellValue("12345678-1234-1234-1234-1234567890ab")).toBe(
      "—",
    );
    expect(formatAdminCellValue(null)).toBe("—");
    expect(formatAdminCellValue("")).toBe("—");
    expect(formatAdminCellValue(100)).toBe("100");
    expect(formatAdminCellValue(true)).toBe("Yes");
    expect(formatAdminCellValue(false)).toBe("No");
  });

  it("adminCellText formats returnReference and reasonCode", () => {
    const row = {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      reasonCode: "NO_LONGER_NEEDED",
    };
    expect(adminCellText(row, "returnReference")).toBe("#RET-A1B2C3D4");
    expect(adminCellText(row, "reasonCode")).toBe("No longer needed");
  });

  it("shouldInferAdminColumn strictly ignores id and id-like keys", () => {
    expect(shouldInferAdminColumn("id")).toBe(false);
    expect(shouldInferAdminColumn("userId")).toBe(false);
    expect(shouldInferAdminColumn("orderId")).toBe(false);
    expect(shouldInferAdminColumn("vendorId")).toBe(false);
    expect(shouldInferAdminColumn("passwordHash")).toBe(false);
    expect(shouldInferAdminColumn("name")).toBe(true);
    expect(shouldInferAdminColumn("status")).toBe(true);
  });
});
