import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductDetail } from "@/shared/api/types";
import { useProduct } from "../../api/products.queries";
import { ProductVariantDialog } from "../ProductVariantDialog.component";

vi.mock("../../api/products.queries", () => ({
  useProduct: vi.fn(),
}));

const product = {
  id: "product-1",
  slug: "test-shirt",
  name: "Test shirt",
  description: "",
  basePrice: 100,
  avgRating: 0,
  reviewCount: 0,
  imageUrl: "",
  stock: 8,
  categoryId: "category-1",
  status: "ACTIVE",
  images: [],
  vendor: {
    id: "vendor-1",
    businessName: "Seller",
    slug: "seller",
    logoUrl: null,
  },
  variants: [
    {
      id: "variant-red",
      sku: "SHIRT-RED",
      attributes: { Color: "Red" },
      price: 100,
      stock: 4,
      lowStockAt: 2,
    },
    {
      id: "variant-blue",
      sku: "SHIRT-BLUE",
      attributes: { Color: "Blue" },
      price: 120,
      stock: 4,
      lowStockAt: 2,
    },
  ],
} satisfies ProductDetail;

describe("ProductVariantDialog", () => {
  beforeEach(() => {
    vi.mocked(useProduct).mockReturnValue({
      data: product,
      isLoading: false,
    } as unknown as ReturnType<typeof useProduct>);
  });

  it("adds the variant selected in the product option UI", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ProductVariantDialog
        open
        productName={product.name}
        productSlug={product.slug}
        isAddingToCart={false}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Blue" }));
    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(onConfirm).toHaveBeenCalledWith("variant-blue");
  });

  it("focuses the title without opening an unavailable-option tooltip", () => {
    render(
      <ProductVariantDialog
        open
        productName={product.name}
        productSlug={product.slug}
        isAddingToCart={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Select options" }),
    ).toHaveFocus();
    expect(
      screen.queryByText("Not available with your current selection."),
    ).not.toBeInTheDocument();
  });
});
