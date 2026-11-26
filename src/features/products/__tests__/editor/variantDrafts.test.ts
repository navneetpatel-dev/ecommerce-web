import { describe, expect, it } from "vitest";
import {
  emptyVariantDraft,
  formatVariantOptions,
  isBlankDraft,
  parseVariantOptions,
  toVariantBody,
  validateVariantDraft,
} from "../../utils/product-editor/variantDrafts";

const messages = {
  sku: "sku?",
  skuInvalid: "sku bad",
  price: "price?",
  priceTooHigh: "price high",
  stockTooHigh: "stock high",
  options: "options bad",
};

describe("variant options text", () => {
  it("turns 'Size: M; Colour: Red' into attributes and back", () => {
    const attributes = parseVariantOptions("Size: M; Colour: Red");
    expect(attributes).toEqual({ Size: "M", Colour: "Red" });
    expect(formatVariantOptions(attributes)).toBe("Size: M; Colour: Red");
  });

  it("drops entries without a name or a value and keeps colons inside a value", () => {
    expect(parseVariantOptions("Size; : M; Link: a:b;;")).toEqual({
      Link: "a:b",
    });
    expect(parseVariantOptions("")).toEqual({});
    expect(formatVariantOptions(null)).toBe("");
  });
});

describe("variant drafts", () => {
  it("a row nobody touched is blank (not an error); stock alone does not count", () => {
    expect(isBlankDraft(emptyVariantDraft())).toBe(true);
    expect(isBlankDraft({ ...emptyVariantDraft(), sku: "A" })).toBe(false);
  });

  it("requires a SKU and a price of at least 1", () => {
    const row = emptyVariantDraft();
    expect(validateVariantDraft(row, messages)).toEqual({
      sku: "sku?",
      price: "price?",
    });
    expect(
      validateVariantDraft({ ...row, sku: "S1", price: "0" }, messages),
    ).toEqual({ price: "price?" });
    expect(
      validateVariantDraft({ ...row, sku: "S1", price: "99" }, messages),
    ).toEqual({});
  });

  it("builds the request body: trimmed SKU, numeric price, whole non-negative stock", () => {
    expect(
      toVariantBody({
        key: "k",
        sku: "  S1 ",
        price: "99.5",
        stock: "-3",
        options: "Size: M",
      }),
    ).toEqual({
      sku: "S1",
      attributes: { Size: "M" },
      price: 99.5,
      stock: 0,
    });
    expect(
      toVariantBody({
        ...emptyVariantDraft(),
        sku: "a",
        price: "5",
        stock: "7.9",
      }).stock,
    ).toBe(7);
  });
});

describe("variant limits (same as the API's)", () => {
  const ok = { ...emptyVariantDraft(), sku: "S-1", price: "10" };

  it("SKU: at most 64 characters of letters, digits and . _ / -", () => {
    expect(
      validateVariantDraft({ ...ok, sku: "A".repeat(64) }, messages),
    ).toEqual({});
    for (const sku of ["A".repeat(65), "has space", "-lead", "bad#"]) {
      expect(validateVariantDraft({ ...ok, sku }, messages).sku).toBe(
        "sku bad",
      );
    }
  });

  it("price: at most ₹1,00,00,000; stock: at most 1,000,000", () => {
    expect(
      validateVariantDraft({ ...ok, price: "10000000" }, messages),
    ).toEqual({});
    expect(
      validateVariantDraft({ ...ok, price: "10000001" }, messages).price,
    ).toBe("price high");
    expect(
      validateVariantDraft({ ...ok, stock: "1000001" }, messages).stock,
    ).toBe("stock high");
  });

  it("options: at most 10, names up to 40 and values up to 80 characters, each with a name and a value", () => {
    const many = Array.from({ length: 11 }, (_, i) => `N${i}: v`).join("; ");
    expect(
      validateVariantDraft({ ...ok, options: many }, messages).options,
    ).toBe("options bad");
    expect(
      validateVariantDraft({ ...ok, options: `${"n".repeat(41)}: v` }, messages)
        .options,
    ).toBe("options bad");
    expect(
      validateVariantDraft({ ...ok, options: `n: ${"v".repeat(81)}` }, messages)
        .options,
    ).toBe("options bad");
    expect(
      validateVariantDraft({ ...ok, options: "Size" }, messages).options,
    ).toBe("options bad");
    expect(
      validateVariantDraft(
        { ...ok, options: `${"n".repeat(40)}: ${"v".repeat(80)}` },
        messages,
      ),
    ).toEqual({});
  });
});
