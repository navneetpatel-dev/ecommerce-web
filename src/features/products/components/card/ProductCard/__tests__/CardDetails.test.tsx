import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardDetails } from "../CardDetails.component";
import type { ProductListItem } from "@/shared/api/types";

const product: ProductListItem = {
  id: "product-1",
  slug: "product-1",
  name: "Test product",
  basePrice: 100,
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
      <CardDetails product={product} showMrp={false} discountPercent={33} />,
    );
    expect(screen.queryByText("₹150")).not.toBeInTheDocument();

    rerender(<CardDetails product={product} showMrp discountPercent={33} />);
    expect(screen.getByText("₹150")).toBeInTheDocument();
  });
});
