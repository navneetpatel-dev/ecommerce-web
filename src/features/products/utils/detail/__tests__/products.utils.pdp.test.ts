import { describe, it } from "vitest";
import assert from "node:assert/strict";
import type { ProductVariant } from "../../../../../shared/api/types";
import {
  findMatchingVariant,
  findSelectedVariant,
  groupVariantAttributes,
  resolveDefaultVariantSelection,
} from "../../variants/products.utils";

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

describe("findSelectedVariant — price for a sold-out selection", () => {
  // Mirrors "Comics Ultra 219": Large sizes are sold out and priced above base.
  const variants = [
    variant({
      id: "std-black",
      attributes: { Size: "Standard", Color: "Black" },
      price: 1161.25,
      stock: 52,
    }),
    variant({
      id: "large-black",
      attributes: { Size: "Large", Color: "Black" },
      price: 1261.25,
      stock: 0,
    }),
  ];

  it("resolves a sold-out variant that findMatchingVariant refuses", () => {
    const selection = { Size: "Large", Color: "Black" };

    // findMatchingVariant guards add-to-cart, so it must stay null here.
    assert.equal(findMatchingVariant(variants, selection), null);
    assert.equal(findSelectedVariant(variants, selection)?.price, 1261.25);
  });

  it("still resolves an in-stock selection", () => {
    const selection = { Size: "Standard", Color: "Black" };
    assert.equal(findSelectedVariant(variants, selection)?.id, "std-black");
  });

  it("returns null until every matrix attribute is chosen", () => {
    assert.equal(findSelectedVariant(variants, { Size: "Large" }), null);
    assert.equal(findSelectedVariant(variants, {}), null);
  });
});
