import { describe, expect, it } from "vitest";
import {
  SEO_DESCRIPTION_RECOMMENDED,
  SEO_TITLE_RECOMMENDED,
  seoPreviewText,
} from "../../utils/product-editor/seoPreview";

const base = {
  seoTitle: "",
  seoDescription: "",
  name: "Steel Stock Pot",
  description: "A 5 litre induction-ready pot.",
};

describe("search result preview", () => {
  it("falls back to the product name and description, and says so", () => {
    expect(seoPreviewText(base)).toEqual({
      title: "Steel Stock Pot",
      description: "A 5 litre induction-ready pot.",
      usesFallback: true,
    });
  });

  it("prefers the SEO fields; no fallback note when both are filled", () => {
    const preview = seoPreviewText({
      ...base,
      seoTitle: "Buy Stock Pot",
      seoDescription: "Best pot.",
    });
    expect(preview).toEqual({
      title: "Buy Stock Pot",
      description: "Best pot.",
      usesFallback: false,
    });
  });

  it("cuts long text where search engines do, with an ellipsis, and collapses whitespace", () => {
    const preview = seoPreviewText({
      ...base,
      seoTitle: "A".repeat(80),
      seoDescription: `${"word ".repeat(60)}`,
    });
    expect(preview.title).toHaveLength(SEO_TITLE_RECOMMENDED);
    expect(preview.title.endsWith("…")).toBe(true);
    expect(preview.description.length).toBeLessThanOrEqual(
      SEO_DESCRIPTION_RECOMMENDED,
    );
    expect(preview.description).not.toMatch(/\s{2,}/);
  });
});
