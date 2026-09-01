import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalletApplySection } from "../WalletApplySection.component";

describe("WalletApplySection", () => {
  it("hides wallet input when COD is selected", () => {
    render(
      <WalletApplySection
        walletBalance={500}
        maxApplicable={200}
        walletAmountToUse={0}
        amountDue={800}
        codSelected
        onAmountChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/cannot be used with cash on delivery/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/points to apply/i)).not.toBeInTheDocument();
  });

  it("shows amount input for non-COD checkout", () => {
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
    expect(screen.getByRole("button", { name: /use full balance/i })).toBeInTheDocument();
  });

  it("does not call onAmountChange when COD is selected", () => {
    const onAmountChange = vi.fn();
    render(
      <WalletApplySection
        walletBalance={500}
        maxApplicable={200}
        walletAmountToUse={0}
        amountDue={800}
        codSelected
        onAmountChange={onAmountChange}
      />,
    );

    expect(onAmountChange).not.toHaveBeenCalled();
  });
});
