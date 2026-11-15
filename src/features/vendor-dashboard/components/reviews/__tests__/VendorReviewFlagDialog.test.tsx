import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VendorReviewFlagDialog } from "../VendorReviewFlagDialog.component";

describe("VendorReviewFlagDialog", () => {
  it("renders when open and triggers onSubmit with trimmed reason", () => {
    const handleSubmit = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <VendorReviewFlagDialog
        open={true}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />,
    );

    expect(screen.getByText("Flag Review for Moderation")).toBeInTheDocument();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: "Review is fake and uses abusive language" },
    });

    const submitBtn = screen.getByRole("button", { name: "Submit Report" });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      "Review is fake and uses abusive language",
    );
  });

  it("disables submit button when input is empty", () => {
    render(
      <VendorReviewFlagDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "Submit Report" });
    expect(submitBtn).toBeDisabled();
  });
});
