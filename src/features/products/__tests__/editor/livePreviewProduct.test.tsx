import { describe, expect, it } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { emptyProductListingValues } from "../../types/listing-form/productListingForm.types";
import { emptyVariantDraft } from "../../utils/product-editor/variantDrafts";
import { buildPreviewProduct } from "../../utils/preview/buildPreviewProduct";

const pricing = {
  gstPercentage: 18,
  displayPrice: 1180,
  compareAtPrice: 1499,
  showMrp: true,
  discountPercent: 21,
  savings: 319,
  variantDisplayPrices: [1180, 2360],
};

const filled = {
  ...emptyProductListingValues("c1"),
  name: "  Steel Pot ",
  price: "1000",
  compareAtPrice: "1499",
  description: "A 5 litre pot.",
  brand: "Hawkins",
  tagsInput: "steel, pot",
  highlights: ["Induction ready", " "],
  specs: [
    { key: "Material", value: "Steel" },
    { key: "", value: "x" },
  ],
  codMode: "on" as const,
};

describe("the product as the customer page would receive it, from the form", () => {
  const base = {
    values: filled,
    mode: "create" as const,
    imageUrls: ["https://cdn/a.jpg", "https://cdn/b.jpg"],
    variantRows: [],
    saved: null,
    category: { id: "c1", name: "Cookware" },
    pricing,
  };

  it("takes the API's customer price, MRP, % off and GST (nothing calculated here)", () => {
    const product = buildPreviewProduct(base);
    expect([
      product.displayPrice,
      product.compareAtPrice,
      product.showMrp,
      product.discountPercent,
      product.gstPercentage,
    ]).toEqual([1180, 1499, true, 21, 18]);
  });

  it("uses the typed details, tidied: trimmed name, no blank highlights or incomplete specs", () => {
    const product = buildPreviewProduct(base);
    expect(product.name).toBe("Steel Pot");
    expect(product.highlights).toEqual(["Induction ready"]);
    expect(product.specs).toEqual({ Material: "Steel" });
    expect(product.tags).toEqual(["steel", "pot"]);
    expect(product.categoryName).toBe("Cookware");
    expect(product.codEnabled).toBe(true);
  });

  it("the first uploaded image is the main one; there are no ratings or reviews", () => {
    const product = buildPreviewProduct(base);
    expect(product.images.map((image) => [image.url, image.isPrimary])).toEqual(
      [
        ["https://cdn/a.jpg", true],
        ["https://cdn/b.jpg", false],
      ],
    );
    expect(product.imageUrl).toBe("https://cdn/a.jpg");
    expect([product.avgRating, product.reviewCount]).toEqual([0, 0]);
  });

  it("variant rows become variants with the API's GST-inclusive price; blank rows are ignored", () => {
    const rows = [
      {
        ...emptyVariantDraft(),
        sku: "S1",
        price: "1000",
        stock: "5",
        options: "Size: M",
      },
      {
        ...emptyVariantDraft(),
        sku: "S2",
        price: "2000",
        stock: "3",
        options: "Size: L",
      },
      emptyVariantDraft(),
    ];
    const product = buildPreviewProduct({ ...base, variantRows: rows });
    expect(
      product.variants.map((v) => [
        v.sku,
        v.attributes,
        v.displayPrice,
        v.stock,
      ]),
    ).toEqual([
      ["S1", { Size: "M" }, 1180, 5],
      ["S2", { Size: "L" }, 2360, 3],
    ]);
    expect(product.stock).toBe(8);
  });

  it("an empty form still previews (a placeholder name), and editing uses the saved images and variants", () => {
    expect(
      buildPreviewProduct({
        ...base,
        values: emptyProductListingValues(),
        pricing: null,
        imageUrls: [],
      }).name,
    ).toBe(LABELS.previewNamePlaceholder);
    const saved = {
      id: "p9",
      slug: "pot",
      status: "LIVE",
      images: [{ id: "i1", url: "https://cdn/saved.jpg", isPrimary: true }],
      variants: [
        {
          id: "v1",
          sku: "OLD",
          attributes: {},
          price: 10,
          stock: 2,
          lowStockAt: 5,
        },
      ],
      vendor: { id: "v", businessName: "Acme" },
    };
    const product = buildPreviewProduct({
      ...base,
      mode: "edit",
      saved: saved as never,
    });
    expect([
      product.id,
      product.status,
      product.images[0]!.url,
      product.variants[0]!.sku,
      product.vendor?.businessName,
    ]).toEqual(["p9", "LIVE", "https://cdn/saved.jpg", "OLD", "Acme"]);
  });
});
