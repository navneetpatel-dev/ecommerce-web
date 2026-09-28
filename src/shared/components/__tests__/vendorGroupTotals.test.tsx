import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VendorGroupTotals } from "@/shared/components/orders/VendorGroupTotals.component";

const base = {
  subtotal: 7583.46,
  taxLabel: "IGST",
  taxAmount: 379.17,
  total: 7962.63,
  totalLabel: "Vendor total",
};

describe("VendorGroupTotals", () => {
  it("keeps the block to a single rule so cards do not stack lines", () => {
    // The total is set apart by type, not by a second horizontal rule.
    const { container } = render(
      <VendorGroupTotals {...base} shippingDisplayKey="FREE" />,
    );

    const ruled = container.querySelectorAll(".border-t");
    expect(ruled).toHaveLength(1);
  });

  it("shows the breakdown when shipping or tax apply", () => {
    render(<VendorGroupTotals {...base} shippingDisplayKey="FREE" />);

    expect(screen.getByText("Items (incl. GST)")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    // Prices include GST: the tax row says how much of the total it is.
    expect(screen.getByText("Includes IGST")).toBeInTheDocument();
    expect(screen.getByText("₹7,962.63")).toBeInTheDocument();
  });

  it("collapses to just the total when there is nothing to break down", () => {
    render(
      <VendorGroupTotals
        {...base}
        taxAmount={0}
        shippingDisplayKey={null}
        subtotal={7962.63}
      />,
    );

    // A Subtotal row identical to the total would be noise.
    expect(screen.queryByText("Items (incl. GST)")).not.toBeInTheDocument();
    expect(screen.getByText("Vendor total")).toBeInTheDocument();
  });

  it("shows a paid shipping amount rather than the free label", () => {
    render(
      <VendorGroupTotals
        {...base}
        shippingDisplayKey="PAID"
        shippingCost={47.37}
      />,
    );

    expect(screen.getByText("₹47.37")).toBeInTheDocument();
    expect(screen.queryByText("Free")).not.toBeInTheDocument();
  });

  it("shows a coupon discount when one applies", () => {
    render(
      <VendorGroupTotals {...base} shippingDisplayKey="FREE" discount={250} />,
    );

    expect(screen.getByText("−₹250")).toBeInTheDocument();
  });
});
