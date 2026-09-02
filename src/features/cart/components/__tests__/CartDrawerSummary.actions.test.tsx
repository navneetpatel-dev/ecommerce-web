import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CartDrawerSummary } from "../CartDrawerSummary.component";

describe("CartDrawerSummary actions", () => {
  it("disables navigation with a tooltip while the cart is mutating", async () => {
    const user = userEvent.setup();

    render(<CartDrawerSummary total={100} isCartMutating onClose={vi.fn()} />);

    const checkout = screen.getByRole("button", { name: "Checkout" });
    const viewCart = screen.getByRole("button", { name: "View full cart" });
    expect(checkout).toBeDisabled();
    expect(viewCart).toBeDisabled();
    expect(
      screen.queryByRole("link", { name: "Checkout" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "View full cart" }),
    ).not.toBeInTheDocument();

    await user.hover(checkout.parentElement!);
    expect(
      await screen.findByRole("tooltip", {
        name: "Please wait while your cart updates.",
      }),
    ).toBeInTheDocument();
  });

  it("shows and dismisses the cart mutation message", async () => {
    const user = userEvent.setup();
    const onDismissMutationError = vi.fn();

    render(
      <CartDrawerSummary
        total={100}
        mutationError="Only 2 items are available."
        onDismissMutationError={onDismissMutationError}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Only 2 items are available.",
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismissMutationError).toHaveBeenCalledOnce();
  });
});
