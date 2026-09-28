import { beforeEach, describe, expect, it } from "vitest";
import type { ProductListItem } from "@/shared/api/types";
import { MAX_COMPARED_PRODUCTS } from "../../../constants/compare/compare";
import { useCompareStore } from "../compare.store";
import { readStoredCompare, writeStoredCompare } from "../compareStorage";

function makeProduct(id: string): ProductListItem {
  return {
    id,
    slug: `product-${id}`,
    name: `Product ${id}`,
    basePrice: 100,
    avgRating: 4.5,
    reviewCount: 12,
    imageUrl: "https://example.com/p.jpg",
    stock: 5,
    vendor: { id: "v1", businessName: "Vendor", slug: "vendor", logoUrl: null },
  };
}

describe("compare store", () => {
  beforeEach(() => {
    useCompareStore.setState({ mode: false, products: [] });
    window.sessionStorage.clear();
  });

  it("toggles a product in and out of the tray", () => {
    const product = makeProduct("a");
    useCompareStore.getState().toggle(product);

    expect(useCompareStore.getState().products.map((p) => p.id)).toEqual(["a"]);

    useCompareStore.getState().toggle(product);
    expect(useCompareStore.getState().products).toEqual([]);
  });

  it("stops accepting products once the maximum is reached", () => {
    for (let i = 0; i < MAX_COMPARED_PRODUCTS + 2; i += 1) {
      useCompareStore.getState().toggle(makeProduct(`p${i}`));
    }

    expect(useCompareStore.getState().products).toHaveLength(
      MAX_COMPARED_PRODUCTS,
    );
  });

  it("persists the selection to sessionStorage and clears it", () => {
    useCompareStore.getState().toggle(makeProduct("b"));
    expect(readStoredCompare().map((p) => p.id)).toEqual(["b"]);

    useCompareStore.getState().clear();
    expect(readStoredCompare()).toEqual([]);
  });

  it("degrades to an empty tray when stored data is not an array", () => {
    window.sessionStorage.setItem("compareSelection", "{not-json");
    expect(readStoredCompare()).toEqual([]);

    writeStoredCompare([]);
    expect(window.sessionStorage.getItem("compareSelection")).toBeNull();
  });
});
