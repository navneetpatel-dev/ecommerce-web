import { describe, it } from "vitest";
import assert from "node:assert/strict";
import type { ProductVariant } from "../../../../shared/api/types";
import {
  findMatchingVariant,
  groupVariantAttributes,
  resolveDefaultVariantSelection,
} from "../products.utils";

function variant(
  partial: Partial<ProductVariant> & Pick<ProductVariant, "id" | "attributes">,
): ProductVariant {
  return {
    id: partial.id,
    sku: partial.sku ?? `SKU-${partial.id}`,
    attributes: partial.attributes,
    price: partial.price ?? 1000,
    stock: partial.stock ?? 5,
    lowStockAt: partial.lowStockAt ?? 2,
    weightGrams: partial.weightGrams,
  };
}

describe("PDP variant selection utils", () => {
  it("defaults to the first in-stock matrix combination", () => {
    const variants = [
      variant({
        id: "v-oos",
        attributes: { Color: "Red", Size: "M" },
        stock: 0,
      }),
      variant({
        id: "v-ok",
        attributes: { Color: "Blue", Size: "L" },
        stock: 4,
      }),
    ];

    assert.deepEqual(resolveDefaultVariantSelection(variants), {
      Color: "Blue",
      Size: "L",
    });
    assert.equal(
      findMatchingVariant(variants, { Color: "Blue", Size: "L" })?.id,
      "v-ok",
    );
  });

  it("returns an empty selection when every variant is out of stock", () => {
    const variants = [
      variant({
        id: "v1",
        attributes: { Color: "Red" },
        stock: 0,
      }),
      variant({
        id: "v2",
        attributes: { Color: "Blue" },
        stock: 0,
      }),
    ];

    assert.deepEqual(resolveDefaultVariantSelection(variants), {});
    assert.equal(findMatchingVariant(variants, {}), null);
  });

  it("groups matrix attribute values for the PDP selector", () => {
    const variants = [
      variant({ id: "a", attributes: { Color: "Red", Size: "M" } }),
      variant({ id: "b", attributes: { Color: "Blue", Size: "M" } }),
      variant({ id: "c", attributes: { Color: "Red", Size: "L" } }),
    ];

    assert.deepEqual(groupVariantAttributes(variants), {
      Color: ["Red", "Blue"],
      Size: ["M", "L"],
    });
  });

  it("selects a lone in-stock variant without attributes", () => {
    const variants = [variant({ id: "solo", attributes: {}, stock: 3 })];
    assert.deepEqual(resolveDefaultVariantSelection(variants), {});
    assert.equal(findMatchingVariant(variants, {})?.id, "solo");
  });
});
