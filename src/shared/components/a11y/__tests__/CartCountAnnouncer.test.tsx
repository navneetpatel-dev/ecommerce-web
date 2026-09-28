import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartCountAnnouncer } from "../CartCountAnnouncer.component";
import { cartCountAnnouncement } from "@/shared/utils/a11y/cartAnnouncement";

describe("cartCountAnnouncement", () => {
  it("counts items in the plural", () => {
    expect(cartCountAnnouncement(3)).toBe("3 items in your cart.");
  });

  it("uses the singular for one item", () => {
    expect(cartCountAnnouncement(1)).toBe("1 item in your cart.");
  });

  it("reports an emptied cart as a state, not a zero count", () => {
    expect(cartCountAnnouncement(0)).toBe("Your cart is empty.");
  });
});

describe("CartCountAnnouncer", () => {
  it("stays silent on mount so a page load announces nothing", () => {
    render(<CartCountAnnouncer count={2} />);

    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("announces the new count when the cart changes", () => {
    const { rerender } = render(<CartCountAnnouncer count={0} />);

    rerender(<CartCountAnnouncer count={1} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "1 item in your cart.",
    );
  });

  it("stays silent when the count is unchanged", () => {
    const { rerender } = render(<CartCountAnnouncer count={2} />);

    rerender(<CartCountAnnouncer count={2} />);

    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});
