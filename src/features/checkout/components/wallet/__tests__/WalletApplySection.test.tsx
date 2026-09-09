import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WalletApplySection } from "../WalletApplySection.component";

describe("WalletApplySection", () => {
  it("shows amount input and use-full-balance action", () => {
    render(
      <WalletApplySection
        walletBalance={500}
        maxApplicable={200}
        walletAmountToUse={100}
        amountDue={700}
        onAmountChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/points to apply/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /use full balance/i }),
    ).toBeInTheDocument();
  });

  it("calls onAmountChange with max when use full balance is clicked", async () => {
    const user = userEvent.setup();
    const onAmountChange = vi.fn();
    render(
      <WalletApplySection
        walletBalance={500}
        maxApplicable={200}
        walletAmountToUse={0}
        amountDue={800}
        onAmountChange={onAmountChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /use full balance/i }));
    expect(onAmountChange).toHaveBeenCalledWith(200);
  });

  it("hides section when wallet balance is zero", () => {
    const { container } = render(
      <WalletApplySection
        walletBalance={0}
        maxApplicable={0}
        walletAmountToUse={0}
        amountDue={800}
        onAmountChange={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
