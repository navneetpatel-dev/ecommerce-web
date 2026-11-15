import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VendorReturnDisputeDialog } from "../VendorReturnDisputeDialog.component";

describe("VendorReturnDisputeDialog", () => {
  it("renders with product name and submits filled dispute details", () => {
    const handleSubmit = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <VendorReturnDisputeDialog
        open={true}
        productName="Wireless Earbuds"
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
      />,
    );

    expect(screen.getByText("Dispute Returned Item")).toBeInTheDocument();
    expect(screen.getByText(/Wireless Earbuds/)).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    // inputs[0] is Reason, inputs[1] is Description, inputs[2] is Evidence URL
    fireEvent.change(inputs[0]!, {
      target: { value: "Damaged item returned" },
    });
    fireEvent.change(inputs[1]!, {
      target: { value: "Customer sent back broken item with missing parts" },
    });
    fireEvent.change(inputs[2]!, {
      target: { value: "https://example.com/photo.jpg" },
    });

    const submitBtn = screen.getByRole("button", { name: "Submit Dispute" });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      reason: "Damaged item returned",
      description: "Customer sent back broken item with missing parts",
      evidenceUrls: ["https://example.com/photo.jpg"],
    });
  });

  it("disables submit button when required inputs are empty", () => {
    render(
      <VendorReturnDisputeDialog
        open={true}
        productName="Wireless Earbuds"
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "Submit Dispute" });
    expect(submitBtn).toBeDisabled();
  });
});
