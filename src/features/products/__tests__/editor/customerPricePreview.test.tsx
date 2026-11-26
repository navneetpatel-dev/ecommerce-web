import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LABELS } from "@/shared/constants/labels";
import { productsApi } from "../../api/listing/products.api";
import { CustomerPricePreview } from "../../components/product-editor/CustomerPricePreview.component";
import { ProductCustomerPreviewDialog } from "../../components/preview/ProductCustomerPreviewDialog.component";
import { priceNudge } from "../../utils/product-editor/priceNudge";

vi.mock("../../components/detail/ProductDetailContent/index", () => ({
  ProductDetailContent: ({ product }: { product: { name: string } }) => (
    <div data-testid="customer-page">{product.name}</div>
  ),
}));

const base = {
  displayPrice: 1180,
  gstPercentage: 18,
  compareAtPrice: 1499,
  showMrp: true,
  discountPercent: 21,
  savings: 319,
};

describe("how customers will see the price", () => {
  it("shows the price, the struck-through MRP, the % off, the GST line and the saving", () => {
    render(<CustomerPricePreview preview={base} />);
    expect(screen.getByText(LABELS.customerPriceTitle)).toBeInTheDocument();
    expect(screen.getByText("21% off")).toBeInTheDocument();
    expect(screen.getByText(`${LABELS.listPrice}:`)).toBeInTheDocument();
    expect(screen.getByText(/Customers save/)).toBeInTheDocument();
    expect(screen.getByText(/GST 18%/)).toBeInTheDocument();
  });

  it("without an MRP it shows only the price and says how to get a discount", () => {
    render(
      <CustomerPricePreview
        preview={{
          ...base,
          compareAtPrice: null,
          showMrp: false,
          discountPercent: null,
          savings: null,
        }}
      />,
    );
    expect(screen.queryByText(/^\d+% off$/)).toBeNull();
    expect(screen.queryByText(`${LABELS.listPrice}:`)).toBeNull();
    expect(screen.getByText(LABELS.customerPriceNoMrp)).toBeInTheDocument();
  });

  it("before there is anything to show it says what is missing: a category first, then a price", () => {
    const { rerender } = render(
      <CustomerPricePreview preview={null} missing="category" />,
    );
    expect(
      screen.getByText(LABELS.customerPriceNeedsCategory),
    ).toBeInTheDocument();
    rerender(<CustomerPricePreview preview={null} missing="price" />);
    expect(
      screen.getByText(LABELS.customerPriceNeedsPrice),
    ).toBeInTheDocument();
  });
});

describe("discount suggestions", () => {
  it("only an unusual discount gets a note", () => {
    expect(priceNudge(base)).toBeNull();
    expect(priceNudge({ ...base, discountPercent: 70 })).toMatch(
      /very large discount/,
    );
    expect(priceNudge({ ...base, discountPercent: 4 })).toMatch(
      /rarely noticed/,
    );
    expect(priceNudge({ ...base, discountPercent: 5 })).toBeNull();
    expect(
      priceNudge({
        ...base,
        compareAtPrice: null,
        showMrp: false,
        discountPercent: null,
      }),
    ).toBe(LABELS.customerPriceNoMrp);
    expect(
      priceNudge({ ...base, showMrp: false, discountPercent: null }),
    ).toBeNull();
  });
});

describe("view as customer", () => {
  function renderDialog() {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <ProductCustomerPreviewDialog
          productId="p1"
          open
          onOpenChange={vi.fn()}
        />
      </QueryClientProvider>,
    );
  }

  it("loads the product with the team's own access and shows the customer page for it", async () => {
    const detail = vi.spyOn(productsApi, "detail").mockResolvedValue({
      id: "p1",
      name: "Steel Pot",
      status: "LIVE",
      variants: [],
      images: [],
    } as never);
    renderDialog();
    expect(await screen.findByTestId("customer-page")).toHaveTextContent(
      "Steel Pot",
    );
    expect(detail).toHaveBeenCalledWith("p1");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("says so when the product is not live yet", async () => {
    vi.spyOn(productsApi, "detail").mockResolvedValue({
      id: "p1",
      name: "Draft Pot",
      status: "PENDING_APPROVAL",
      variants: [],
      images: [],
    } as never);
    renderDialog();
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        /not visible to customers yet.*pending approval/i,
      ),
    );
  });
});
