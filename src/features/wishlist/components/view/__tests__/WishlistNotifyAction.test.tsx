import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";
import { WishlistNotifyAction } from "../WishlistNotifyAction.component";

vi.mock("@/features/stockAlerts", () => ({
  NotifyMeButton: ({ variantId }: { variantId: string }) => (
    <button type="button">subscribe {variantId}</button>
  ),
}));

const product = (...ids: string[]) =>
  ({ slug: "pot", variants: ids.map((id) => ({ id })) }) as never;

describe("wishlist back-in-stock action", () => {
  it("subscribes in place when there is one option", () => {
    render(<WishlistNotifyAction product={product("v1")} />);
    expect(screen.getByRole("button")).toHaveTextContent("subscribe v1");
  });

  it("sends the shopper to the product to choose when there are several", () => {
    render(<WishlistNotifyAction product={product("v1", "v2")} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(
      screen.getByRole("link", {
        name: stockAlertsLabels.notifyMeChooseOption,
      }),
    ).toHaveAttribute("href", "/products/pot");
  });

  it("offers nothing without a variant", () => {
    const { container } = render(<WishlistNotifyAction product={product()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
