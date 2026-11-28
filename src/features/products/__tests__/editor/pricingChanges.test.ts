import { describe, expect, it } from "vitest";
import { pricingFieldsChanged } from "../../utils/product-editor/pricingChanges";

const stored = {
  basePrice: 100,
  compareAtPrice: 150,
  categoryId: "c1",
  hsnCode: "6109",
  codEnabled: null,
};
const same = {
  basePrice: 100,
  compareAtPrice: 150,
  categoryId: "c1",
  hsnCode: "6109",
  codEnabled: null,
};

describe("pricingFieldsChanged", () => {
  it("is false when the form sends the stored values back (string decimals included)", () => {
    expect(pricingFieldsChanged(stored, same)).toBe(false);
    expect(
      pricingFieldsChanged({ ...stored, basePrice: "100.00" as never }, same),
    ).toBe(false);
  });

  it("notices a changed category, which sets the GST and commission", () => {
    expect(pricingFieldsChanged(stored, { ...same, categoryId: "c2" })).toBe(
      true,
    );
  });

  it("notices a changed price, MRP, HSN code or COD", () => {
    expect(pricingFieldsChanged(stored, { ...same, basePrice: 90 })).toBe(true);
    expect(
      pricingFieldsChanged(stored, { ...same, compareAtPrice: null }),
    ).toBe(true);
    expect(pricingFieldsChanged(stored, { ...same, hsnCode: "6110" })).toBe(
      true,
    );
    expect(pricingFieldsChanged(stored, { ...same, codEnabled: false })).toBe(
      true,
    );
  });

  it("an empty HSN code equals a missing one", () => {
    expect(
      pricingFieldsChanged(
        { ...stored, hsnCode: undefined },
        { ...same, hsnCode: null },
      ),
    ).toBe(false);
  });
});
