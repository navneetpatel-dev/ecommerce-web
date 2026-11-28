import { describe, expect, it } from "vitest";
import type { ProductVariant } from "@/shared/api/types";
import {
  findMatchingVariant,
  findSelectedVariant,
  isOptionInStock,
  resolveInitialVariantSelection,
} from "../../variants/products.utils";

const variant = (id: string, size: string, aboveMrp = false) =>
  ({
    id,
    attributes: { Size: size },
    stock: 5,
    price: 100,
    aboveMrp,
  }) as unknown as ProductVariant;

const variants = [variant("s", "S", true), variant("m", "M")];

describe("an option priced above the MRP", () => {
  it("is not chosen by default, though it is in stock", () => {
    expect(resolveInitialVariantSelection(variants, null)).toEqual({
      Size: "M",
    });
  });

  it("cannot be added to the cart, but still shows its own figures", () => {
    expect(findMatchingVariant(variants, { Size: "S" })).toBeNull();
    expect(findSelectedVariant(variants, { Size: "S" })?.id).toBe("s");
    expect(isOptionInStock(variants, {}, "Size", "S")).toBe(false);
  });
});
