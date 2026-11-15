import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VendorReviewRespondDialog } from "../VendorReviewRespondDialog.component";

describe("VendorReviewRespondDialog", () => {
  it("renders when open and triggers onSubmit with trimmed response", () => {
    const handleSubmit = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <VendorReviewRespondDialog
        open={true}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />,
    );

    expect(screen.getByText("Respond to review")).toBeInTheDocument();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: "Thank you for the detailed feedback!" },
    });

    const submitBtn = screen.getByRole("button", { name: "Respond" });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      "Thank you for the detailed feedback!",
    );
  });

  it("disables submit button when input is empty", () => {
    render(
      <VendorReviewRespondDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "Respond" });
    expect(submitBtn).toBeDisabled();
  });
});
