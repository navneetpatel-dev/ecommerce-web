import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LABELS } from "@/shared/constants/labels";
import { ProductRejectionNote } from "@/features/products";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ProductActions } from "../../components/products/ProductsTable/ProductActions.component";

const product = {
  id: "p1",
  name: "Mug",
  sku: "S1",
  stock: 1,
  lowStockAt: 5,
  basePrice: 100,
  status: "REJECTED",
};

describe("a rejected listing", () => {
  it("offers the vendor a resubmit action", () => {
    render(<ProductActions product={product} onSubmitForApproval={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: LABELS.moreActions }));
    expect(
      screen.getByRole("button", { name: LABELS.resubmitForApproval }),
    ).toBeInTheDocument();
  });

  it("says why it was rejected", () => {
    render(<ProductRejectionNote status="REJECTED" note="Fix the title" />);
    expect(
      screen.getByText(
        formatLabel(LABELS.productRejectedBecause, { note: "Fix the title" }),
      ),
    ).toBeInTheDocument();
  });
});
