import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EligibleOfferItem } from "../EligibleOfferItem.component";

describe("EligibleOfferItem", () => {
  it("renders offer code, benefit name, and detail with copy support", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(
      <EligibleOfferItem
        offer={{
          code: "FESTIVE25",
          name: "25% off",
          type: "PERCENTAGE",
          discount: 250,
          minOrderValue: 1000,
          cashbackAmount: 0,
          priority: 0,
        }}
      />,
    );

    expect(screen.getByText("FESTIVE25")).toBeDefined();
    expect(screen.getByText("25% off")).toBeDefined();
    expect(screen.getByText(/Save ₹250/)).toBeDefined();
    expect(screen.getByText(/Min order ₹1,000/)).toBeDefined();

    const copyBtn = screen.getByLabelText("Copy coupon code FESTIVE25");
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith("FESTIVE25");
    await waitFor(() => {
      expect(screen.getByText("COPIED")).toBeDefined();
    });
  });
});
