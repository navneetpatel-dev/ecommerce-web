import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LABELS } from "@/shared/constants/labels";
import { ProductDetailsSection } from "../../components/product-editor/ProductDetailsSection.component";

const values = {
  name: "Pot",
  brand: "",
  categoryId: "c1",
  price: "1000",
  compareAtPrice: "",
  description: "",
} as never;

const guide = {
  priceHint: "₹1000 + 18% GST = customers pay ₹1,180",
  mrpHint: "Optional. Enter the MRP including GST; it must be at least ₹1,180.",
  customerPrice: 1180,
};

function renderSection(
  over: Record<string, unknown> = {},
  patchValues = vi.fn(),
) {
  render(
    <ProductDetailsSection
      values={{ ...(values as object), ...over } as never}
      category={{ selected: null, onSelect: vi.fn() }}
      disabled={false}
      getError={() => undefined}
      patchValues={patchValues}
      priceGuide={guide}
      pricingLock={{ locked: false }}
    />,
  );
  return patchValues;
}

describe("price, GST and MRP guidance", () => {
  it("shows the breakdown under the price and the minimum under the MRP", () => {
    renderSection();
    expect(screen.getByText(guide.priceHint)).toBeInTheDocument();
    expect(screen.getByText(guide.mrpHint)).toBeInTheDocument();
  });

  it("offers to use what customers pay as the MRP, and fills it in", () => {
    const patch = renderSection();
    fireEvent.click(screen.getByRole("button", { name: "Use ₹1,180.00" }));
    expect(patch).toHaveBeenCalledWith({ compareAtPrice: "1180" });
  });

  it("warns when the MRP is below what customers pay, and still offers the fix", () => {
    renderSection({ compareAtPrice: "1000" });
    expect(
      screen.getByText(/MRP must be at least ₹1,180\.00/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Use ₹1,180.00" }),
    ).toBeInTheDocument();
  });

  it("no warning and no button when the MRP covers it", () => {
    renderSection({ compareAtPrice: "1499" });
    expect(screen.queryByText(/MRP must be at least/)).toBeNull();
    expect(screen.queryByRole("button", { name: /Use ₹/ })).toBeNull();
  });

  it("without an answer from the API there is nothing to suggest", () => {
    render(
      <ProductDetailsSection
        values={values}
        category={{ selected: null, onSelect: vi.fn() }}
        disabled={false}
        getError={() => undefined}
        patchValues={vi.fn()}
        priceGuide={{
          priceHint: LABELS.productPriceGstHint,
          mrpHint: LABELS.productMrpHint,
          customerPrice: null,
        }}
        pricingLock={{ locked: false }}
      />,
    );
    expect(screen.queryByRole("button", { name: /Use ₹/ })).toBeNull();
  });
});

describe("category comes before price", () => {
  it("the category field is above the price field in the form", () => {
    renderSection();
    const category = screen.getByText(LABELS.selectCategory, {
      selector: "label",
    });
    const price = screen.getByText(LABELS.productPriceExclGst, {
      selector: "label",
    });
    expect(
      category.compareDocumentPosition(price) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
