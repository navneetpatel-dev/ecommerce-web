import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { OrderItem } from "@/shared/api/types";
import { OrderLineReviewSlot } from "../OrderLineReviewSlot.component";

const line = (overrides: Partial<OrderItem>) =>
  ({
    id: "oi-1",
    productName: "Tee",
    productId: "p-1",
    ...overrides,
  }) as OrderItem;

describe("OrderLineReviewSlot", () => {
  it("offers Write a review on a delivered, unreviewed line", async () => {
    const onWriteReview = vi.fn();
    render(
      <OrderLineReviewSlot
        item={line({ canReview: true, review: null })}
        onWriteReview={onWriteReview}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Write a review" }),
    );
    expect(onWriteReview).toHaveBeenCalledTimes(1);
  });

  it("shows the review already left instead of the button", () => {
    render(
      <OrderLineReviewSlot
        item={line({
          canReview: false,
          review: { id: "r-1", rating: 4, status: "PENDING" },
        })}
        onWriteReview={vi.fn()}
      />,
    );
    expect(screen.getByText("Your review: 4★")).toBeInTheDocument();
    expect(screen.getByText("Awaiting approval")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Write a review" })).toBeNull();
  });

  it("renders nothing for a line that is not delivered", () => {
    const { container } = render(
      <OrderLineReviewSlot
        item={line({ canReview: false, review: null })}
        onWriteReview={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
