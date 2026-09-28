import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ProductListItem } from "@/shared/api/types";
import { ComparePage } from "../ComparePage.page";
import { useCompareStore } from "../../../stores/compare/compare.store";

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

describe("ComparePage", () => {
  beforeEach(() => {
    useCompareStore.setState({ mode: false, products: [] });
    window.sessionStorage.clear();
  });

  it("shows the empty state until two products are selected", () => {
    useCompareStore.setState({ products: [makeProduct("a")] });

    render(<ComparePage />);

    expect(screen.getByText("Nothing to compare yet")).toBeInTheDocument();
  });

  it("renders the comparison section once two products are selected", () => {
    useCompareStore.setState({
      products: [makeProduct("a"), makeProduct("b")],
    });

    render(<ComparePage />);

    expect(screen.getByText("Compare products")).toBeInTheDocument();
    expect(screen.getByText("Product a")).toBeInTheDocument();
    expect(screen.getByText("Product b")).toBeInTheDocument();
  });
});
