import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShippingCard } from "../ShippingCard.component";

describe("ShippingCard", () => {
  it("uses shippingDisplayKey instead of inferring free shipping from cost", () => {
    render(
      <ShippingCard
        vendor={{
          id: "vendor-1",
          businessName: "Seller",
          slug: "seller",
          logoUrl: null,
        }}
        options={[
          {
            method: "STANDARD",
            cost: 99,
            shippingDisplayKey: "FREE",
            estimatedDays: 4,
          },
        ]}
        isLoading={false}
        isError={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.queryByText("₹99")).not.toBeInTheDocument();
  });
});
