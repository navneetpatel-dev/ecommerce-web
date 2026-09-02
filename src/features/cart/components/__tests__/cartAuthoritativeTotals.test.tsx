import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CartCouponSection } from "../CartCouponSection.component";
import { OrderSummaryAside } from "../CartPageView/OrderSummaryAside.component";

const couponActions = {
  onCouponInputChange: vi.fn(),
  onApplyCoupon: vi.fn(),
  onRemoveCoupon: vi.fn(),
  onApplyEligible: vi.fn(),
};

describe("cart authoritative totals", () => {
  it("shows updating instead of zero when the cart total is absent", () => {
    render(
      <OrderSummaryAside
        itemCount={1}
        hasUnavailableItems={false}
        couponInput=""
        couponMessage={null}
        couponError={null}
        couponPending={false}
        appliedCouponCode={null}
        appliedDiscount={0}
        eligible={[]}
        {...couponActions}
      />,
    );

    expect(screen.getAllByText("Updating…")).toHaveLength(3);
    expect(screen.queryByText("₹0")).not.toBeInTheDocument();
  });

  it("renders cashback pay-now copy only with an authoritative pay-now total", () => {
    const props = {
      couponInput: "",
      couponMessage: null,
      couponError: null,
      couponPending: false,
      appliedCouponCode: "CASH100",
      appliedDiscount: 0,
      appliedCashbackAmount: 100,
      eligible: [],
      ...couponActions,
    };
    const { rerender } = render(<CartCouponSection {...props} />);
    expect(screen.queryByText(/Pay ₹/)).not.toBeInTheDocument();

    rerender(<CartCouponSection {...props} payNowGrandTotal={500} />);
    expect(
      screen.getByText(/Pay ₹500 now, ₹100 cashback after delivery/),
    ).toBeInTheDocument();
  });
});
