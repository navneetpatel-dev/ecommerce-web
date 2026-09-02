import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CheckoutQuote } from "@/shared/api/types";
import { PaymentStep } from "../PaymentStep.component";

function quote(partial: Partial<CheckoutQuote>): CheckoutQuote {
  return {
    vendorBreakdowns: [],
    grandTotal: 500,
    orderTotals: {
      merchandiseSubtotal: 500,
      shippingTotal: 0,
      taxTotal: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      discountTotal: 0,
      taxDisplayKey: "GST",
    },
    cashbackAmount: 0,
    walletBalance: 100,
    walletAmountToUse: 100,
    amountDue: 400,
    maxWalletApplicable: 100,
    appliedCoupon: null,
    codAvailable: true,
    ...partial,
  };
}

describe("PaymentStep insufficient wallet", () => {
  it("keeps Wallet enabled when points cannot fully cover the order", () => {
    render(
      <PaymentStep
        isPending={false}
        selectedMethod={null}
        quote={quote({})}
        walletAmountToUse={0}
        onSelect={vi.fn()}
        onWalletAmountChange={vi.fn()}
        onContinue={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /wallet points/i }),
    ).toBeEnabled();
  });

  it("allows Continue when partial points are applied and amount remains due", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <PaymentStep
        isPending={false}
        selectedMethod="wallet"
        quote={quote({})}
        walletAmountToUse={100}
        onSelect={vi.fn()}
        onWalletAmountChange={vi.fn()}
        onContinue={onContinue}
        onBack={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/you’ll pay ₹400 online/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /continue to review/i }),
    );
    expect(onContinue).toHaveBeenCalled();
  });

  it("disables Wallet when there are no usable points", () => {
    render(
      <PaymentStep
        isPending={false}
        selectedMethod={null}
        quote={quote({
          walletBalance: 0,
          maxWalletApplicable: 0,
          walletAmountToUse: 0,
          amountDue: 500,
        })}
        walletAmountToUse={0}
        onSelect={vi.fn()}
        onWalletAmountChange={vi.fn()}
        onContinue={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /wallet points/i }),
    ).toBeDisabled();
  });
});
