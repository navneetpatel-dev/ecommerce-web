import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceAvailabilityBlock } from "../../components/detail/ProductDetailContent/PriceAvailabilityBlock.component";

/**
 * A struck-through price tells the shopper "this used to cost more". Only the MRP may be shown that
 * way; the product's base price once was, which put a lower "old" price beside a dearer option.
 */
const SRC = path.resolve(__dirname, "../../../..");
const MAY_STRIKE = [
  "features/products/styles/card/cardDetails.styles.ts", // the MRP on product cards
  "features/products/styles/detail/productDetailContent.styles.ts", // the MRP on the product page
  "features/products/styles/variants/variantSelector.styles.ts", // a sold-out option button
  "shared/components/dialogs/product-view/ProductHeroPriceBadge.component.tsx", // the MRP
];

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory())
      return name === "__tests__" ? [] : sources(full);
    return /\.tsx?$/.test(name) ? [full] : [];
  });
}

const block = (over: { showMrp: boolean; compareAtPrice: number | null }) => (
  <PriceAvailabilityBlock
    displayPrice={192}
    discountPercent={null}
    gstPercentage={28}
    taxInclusiveEstimate={null}
    hsnCode={null}
    sku="SKU-L"
    needsOptionSelection={false}
    variantUnavailable={false}
    displayStock={5}
    lowStockAt={2}
    {...over}
  />
);

describe("struck-through prices", () => {
  it("shows none for an option that has no MRP above its price", () => {
    const { container } = render(
      block({ showMrp: false, compareAtPrice: 170 }),
    );
    expect(container.querySelector(".line-through")).toBeNull();
  });

  it("strikes the MRP when it is above the price", () => {
    const { container } = render(block({ showMrp: true, compareAtPrice: 250 }));
    expect(container.querySelector(".line-through")?.textContent).toContain(
      "250",
    );
  });

  it("is used nowhere new without being added to the list above", () => {
    const using = sources(SRC)
      .filter((file) => readFileSync(file, "utf8").includes("line-through"))
      .map((file) => path.relative(SRC, file).split(path.sep).join("/"));
    expect(using.sort()).toEqual([...MAY_STRIKE].sort());
  });
});
