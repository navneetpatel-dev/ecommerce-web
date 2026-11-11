import { describe, expect, it } from "vitest";
import type { ProductVariant } from "@/shared/api/types";
import {
  changedGroupsForOption,
  findMatchingVariant,
  findSelectedVariant,
  isOptionInStock,
  resolveInitialVariantSelection,
  resolveSelectionForOption,
} from "../../variants/products.utils";

function variant(
  id: string,
  attributes: Record<string, string>,
  stock = 5,
): ProductVariant {
  return { id, attributes, stock, price: 100 } as unknown as ProductVariant;
}

// The product from the run: three variants, no size/colour pair in common.
const clothing = [
  variant("s-maroon", { Size: "S", Color: "Maroon" }),
  variant("m-teal", { Size: "M", Color: "Teal" }),
  variant("l-mustard", { Size: "L", Color: "Mustard" }),
];

// Audio Plus 225 shape: Silver only comes in 128 GB.
const audio = [
  variant("g-64", { Color: "Graphite", Storage: "64 GB" }),
  variant("g-128", { Color: "Graphite", Storage: "128 GB" }),
  variant("s-128", { Color: "Silver", Storage: "128 GB" }),
];

describe("variant options stay reachable (B-25)", () => {
  it("reaches every clothing variant in one click from any other", () => {
    for (const from of clothing) {
      for (const to of clothing) {
        const next = resolveSelectionForOption(
          clothing,
          from.attributes,
          "Size",
          to.attributes.Size,
        );
        expect(findMatchingVariant(clothing, next)?.id).toBe(to.id);
        const byColor = resolveSelectionForOption(
          clothing,
          from.attributes,
          "Color",
          to.attributes.Color,
        );
        expect(findMatchingVariant(clothing, byColor)?.id).toBe(to.id);
      }
    }
  });

  it("marks every in-stock option available and names what it changes", () => {
    const current = clothing[2].attributes;
    expect(isOptionInStock(clothing, current, "Size", "S")).toBe(true);
    expect(changedGroupsForOption(clothing, current, "Size", "S")).toEqual([
      "Color",
    ]);
    expect(changedGroupsForOption(clothing, current, "Size", "L")).toEqual([]);
  });

  it("lands Silver on its 128 GB variant straight from Graphite 64 GB", () => {
    const next = resolveSelectionForOption(
      audio,
      audio[0].attributes,
      "Color",
      "Silver",
    );
    expect(findMatchingVariant(audio, next)?.id).toBe("s-128");
    expect(
      changedGroupsForOption(audio, audio[0].attributes, "Color", "Silver"),
    ).toEqual(["Storage"]);
  });

  it("keeps as many current choices as possible, in-stock first", () => {
    const variants = [
      variant("a", { Size: "M", Color: "Red" }, 0),
      variant("b", { Size: "M", Color: "Blue" }),
      variant("c", { Size: "L", Color: "Green" }),
    ];
    // From L/Green, M has no Green: prefer the in-stock M/Blue over sold-out M/Red.
    const next = resolveSelectionForOption(
      variants,
      variants[2].attributes,
      "Size",
      "M",
    );
    expect(next).toEqual({ Size: "M", Color: "Blue" });
  });
});

describe("sold-out variants can be chosen (B-26)", () => {
  const variants = [
    variant("m-red", { Size: "M", Color: "Red" }),
    variant("l-red", { Size: "L", Color: "Red" }, 0),
  ];

  it("selects the exact sold-out combination so Notify me can show", () => {
    const next = resolveSelectionForOption(
      variants,
      variants[0].attributes,
      "Size",
      "L",
    );
    expect(next).toEqual({ Size: "L", Color: "Red" });
    expect(findMatchingVariant(variants, next)).toBeNull();
    expect(findSelectedVariant(variants, next)?.id).toBe("l-red");
    expect(isOptionInStock(variants, variants[0].attributes, "Size", "L")).toBe(
      false,
    );
  });

  it("opens a fully sold-out product on a real variant", () => {
    const soldOut = variants.map((v) => ({ ...v, stock: 0 }));
    expect(resolveInitialVariantSelection(soldOut)).toEqual({
      Size: "M",
      Color: "Red",
    });
  });

  it("starts on the variant named in the URL", () => {
    expect(resolveInitialVariantSelection(variants, "l-red")).toEqual({
      Size: "L",
      Color: "Red",
    });
    expect(resolveInitialVariantSelection(variants, "unknown")).toEqual({
      Size: "M",
      Color: "Red",
    });
  });
});
