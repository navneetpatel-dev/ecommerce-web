import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ClearCartAction } from "../CartPageView/ClearCartAction.component";

describe("ClearCartAction", () => {
  it("clears the cart only after confirmation", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<ClearCartAction onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClear).not.toHaveBeenCalled();

    const clearButtons = screen.getAllByRole("button", { name: "Clear all" });
    await user.click(clearButtons.at(-1)!);

    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.queryByText("Clear your cart?")).not.toBeInTheDocument();
  });
});
