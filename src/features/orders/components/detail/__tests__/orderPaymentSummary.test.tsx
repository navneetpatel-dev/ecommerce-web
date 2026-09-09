import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderPaymentSummary } from "../OrderPaymentSummary.component";
import type { Order } from "@/shared/api/types";

/**
 * `razorpayAmountPaid` is written at order creation as the amount *to* pay, so
 * it is non-zero long before the webhook confirms capture. These pin that the
 * card never claims settlement the order itself has not recorded.
 */
function order(partial: Partial<Order> = {}) {
  return {
    totalAmount: 6544.05,
    walletAmountUsed: 619.94,
    razorpayAmountPaid: 5924.11,
    pendingCashbackAmount: 0,
    cashbackCreditedAt: null,
    paymentMethod: "RAZORPAY",
    paymentStatus: "PENDING",
    amountDue: 5924.11,
    ...partial,
  } as Order;
}

describe("OrderPaymentSummary payment wording", () => {
  it("says the Razorpay leg is still due while payment is unconfirmed", () => {
    render(<OrderPaymentSummary order={order()} />);

    expect(screen.getByText("₹5,924.11 due via Razorpay")).toBeInTheDocument();
    expect(
      screen.queryByText("₹5,924.11 via Razorpay"),
    ).not.toBeInTheDocument();
  });

  it("explains the wait instead of contradicting the order badge", () => {
    render(<OrderPaymentSummary order={order()} />);

    expect(
      screen.getByText(/still confirming this payment/i),
    ).toBeInTheDocument();
  });

  it("says paid once the order records the capture", () => {
    render(<OrderPaymentSummary order={order({ paymentStatus: "PAID" })} />);

    expect(screen.getByText("₹5,924.11 via Razorpay")).toBeInTheDocument();
    expect(
      screen.queryByText(/still confirming this payment/i),
    ).not.toBeInTheDocument();
  });

  it("still credits points, which are debited at order time either way", () => {
    render(<OrderPaymentSummary order={order()} />);

    expect(screen.getByText(/from points/)).toBeInTheDocument();
  });

  it("does not nag about confirmation for cash on delivery", () => {
    render(
      <OrderPaymentSummary
        order={order({
          paymentMethod: "COD",
          razorpayAmountPaid: 0,
          amountDue: 6544.05,
        })}
      />,
    );

    expect(
      screen.queryByText(/still confirming this payment/i),
    ).not.toBeInTheDocument();
  });
});
