import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductHighlights } from "../ProductHighlights.component";
import { LABELS } from "@/shared/constants/labels";

describe("ProductHighlights", () => {
  it("renders non-empty highlights properly and ignores whitespace items", () => {
    render(
      <ProductHighlights
        highlights={[
          "40mm Dynamic Drivers",
          "  ",
          "Active Noise Cancellation",
          "",
        ]}
      />,
    );

    expect(screen.getByText(LABELS.productHighlights)).toBeDefined();
    expect(screen.getByText("40mm Dynamic Drivers")).toBeDefined();
    expect(screen.getByText("Active Noise Cancellation")).toBeDefined();

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(2);
  });

  it("returns null when no valid highlights exist", () => {
    const { container } = render(
      <ProductHighlights highlights={["", "   "]} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
