import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardDetails } from "../CardDetails.component";
import type { ProductListItem } from "@/shared/api/types";

const product: ProductListItem = {
  id: "product-1",
  slug: "product-1",
  name: "Test product",
  basePrice: 100,
  displayPrice: 118,
  compareAtPrice: 150,
  discountPercent: 33,
  showMrp: false,
  avgRating: 0,
  reviewCount: 0,
  imageUrl: "",
  stock: 1,
  vendor: {
    id: "vendor-1",
    businessName: "Seller",
    slug: "seller",
    logoUrl: null,
  },
};

describe("CardDetails", () => {
  it("shows MRP only when the backend showMrp key is true", () => {
    const { rerender } = render(
      <CardDetails
        product={product}
        price={118}
        showMrp={false}
        discountPercent={21}
      />,
    );
    expect(screen.queryByText("₹150")).not.toBeInTheDocument();

    rerender(
      <CardDetails
        product={product}
        price={118}
        showMrp
        discountPercent={21}
      />,
    );
    expect(screen.getByText("₹150")).toBeInTheDocument();
  });

  it("shows the GST-inclusive price, not the price before GST", () => {
    render(
      <CardDetails
        product={product}
        price={118}
        showMrp={false}
        discountPercent={21}
      />,
    );
    expect(screen.getByText("₹118")).toBeInTheDocument();
    expect(screen.queryByText("₹100")).not.toBeInTheDocument();
  });
});
