import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PurchasePanel } from "../PurchasePanel.component";

vi.mock("@/features/stockAlerts", () => ({
  NotifyMeButton: ({ variantId }: { variantId: string | null }) => (
    <button type="button">Notify me {variantId}</button>
  ),
}));
vi.mock("../../../delivery-check/ProductDeliveryCheck.component", () => ({
  ProductDeliveryCheck: () => null,
}));
vi.mock("@/shared/containers/system/ShareButtonContainer.container", () => ({
  ShareButtonContainer: () => null,
}));

const base = {
  productId: "p1",
  vendorId: "v1",
  needsOptionSelection: false,
  variantUnavailable: false,
  onDeliveryBlockedChange: vi.fn(),
  quantity: 1,
  onQuantityChange: vi.fn(),
  quantityMax: 5,
  quantityDisabled: false,
  quantityDisabledHint: "",
  addToCartHint: "",
  addToCartLabel: "Add to cart",
  isWishlisted: false,
  onToggleWishlist: vi.fn(),
  productName: "Tee",
  productUrl: "http://localhost/products/tee",
};

describe("PurchasePanel", () => {
  it("offers Notify me and no Add button for a sold-out choice", () => {
    render(
      <PurchasePanel
        {...base}
        variantId="l-red"
        canAddToCart={false}
        displayStock={0}
        addDisabled
        isSoldOut
      />,
    );
    expect(
      screen.getByRole("button", { name: /Notify me l-red/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();
  });

  it("keeps Add to cart for an in-stock choice", () => {
    render(
      <PurchasePanel
        {...base}
        variantId="m-red"
        canAddToCart
        displayStock={4}
        addDisabled={false}
        isSoldOut={false}
      />,
    );
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: /Notify me/ }),
    ).not.toBeInTheDocument();
  });
});
