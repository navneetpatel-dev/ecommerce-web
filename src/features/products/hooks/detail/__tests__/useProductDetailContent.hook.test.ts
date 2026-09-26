import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProductDetailContent } from "../useProductDetailContent.hook";

type Params = Parameters<typeof useProductDetailContent>[0];

const variants = [
  {
    id: "v-base",
    sku: "A",
    attributes: { size: "S" },
    price: 1000,
    stock: 5,
    lowStockAt: 1,
    discountPercent: 33,
    showMrp: true,
  },
  {
    id: "v-dearer",
    sku: "B",
    attributes: { size: "M" },
    price: 1400,
    stock: 5,
    lowStockAt: 1,
    discountPercent: 7,
    showMrp: true,
  },
  {
    id: "v-above",
    sku: "C",
    attributes: { size: "L" },
    price: 1600,
    stock: 5,
    lowStockAt: 1,
    discountPercent: null,
    showMrp: false,
  },
];

function render(matchedVariant: (typeof variants)[number] | null) {
  const params = {
    product: {
      basePrice: 1000,
      compareAtPrice: 1500,
      discountPercent: 33,
      showMrp: true,
      variants,
    },
    variantSelection: {
      matchedVariant,
      currentPrice: matchedVariant?.price ?? 1000,
    },
  } as unknown as Params;
  return renderHook(() => useProductDetailContent(params)).result.current;
}

describe("useProductDetailContent MRP discount", () => {
  it("shows the product's discount until a variant is picked", () => {
    const view = render(null);
    expect(view.discountPercent).toBe(33);
    expect(view.showMrp).toBe(true);
  });

  it("shows the selected variant's own discount against the MRP", () => {
    const view = render(variants[1]!);
    expect(view.formattedPrice).toContain("1,400");
    expect(view.discountPercent).toBe(7);
    expect(view.showMrp).toBe(true);
  });

  it("drops the badge and MRP for a variant priced above the MRP", () => {
    const view = render(variants[2]!);
    expect(view.discountPercent).toBeNull();
    expect(view.showMrp).toBe(false);
  });
});
