import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PurchasePanel } from "../../components/detail/ProductDetailContent/PurchasePanel.component";

vi.mock(
  "../../components/delivery-check/ProductDeliveryCheck.component",
  () => ({
    ProductDeliveryCheck: () => <div data-testid="delivery-check" />,
  }),
);
vi.mock("@/features/stockAlerts", () => ({
  NotifyMeButton: () => <div data-testid="notify-me" />,
}));
vi.mock("@/shared/containers/system/ShareButtonContainer.container", () => ({
  ShareButtonContainer: () => <div data-testid="share" />,
}));
vi.mock(
  "../../components/detail/ProductDetailContent/PurchaseActions.component",
  () => ({
    PurchaseActions: () => <div data-testid="add-to-cart" />,
  }),
);

const props = {
  productId: "preview",
  variantId: undefined,
  vendorId: undefined,
  needsOptionSelection: false,
  variantUnavailable: false,
  canAddToCart: false,
  displayStock: 0,
  onDeliveryBlockedChange: vi.fn(),
  quantity: 1,
  onQuantityChange: vi.fn(),
  quantityMax: 1,
  quantityDisabled: false,
  quantityDisabledHint: "",
  addDisabled: true,
  isSoldOut: true,
  addToCartHint: "",
  addToCartLabel: "Add to cart",
  isWishlisted: false,
  onToggleWishlist: vi.fn(),
  productName: "Pot",
  productUrl: "/p/pot",
};

describe("a preview never talks to the server for a product that is not on sale", () => {
  it("no delivery check (it would send the placeholder id), notify-me, wishlist or share", () => {
    render(<PurchasePanel {...props} preview />);
    for (const id of ["delivery-check", "notify-me", "share"]) {
      expect(screen.queryByTestId(id)).toBeNull();
    }
    expect(screen.queryByRole("button", { name: /wishlist/i })).toBeNull();
  });

  it("the storefront keeps all of them", () => {
    render(<PurchasePanel {...props} />);
    for (const id of ["delivery-check", "notify-me", "share"]) {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: /wishlist/i }),
    ).toBeInTheDocument();
  });
});
