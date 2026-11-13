import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { WriteReviewPanelState } from "../../../hooks/write-review/useWriteReviewPanel.hook";
import { WriteReviewPanel } from "../WriteReviewPanel.component";

vi.mock(
  "../../../containers/review-form/ReviewFormContainer.container",
  () => ({
    ReviewFormContainer: () => <form aria-label="review form" />,
  }),
);

const base: WriteReviewPanelState = {
  orderItemId: "oi-1",
  open: false,
  submitted: false,
  highlighted: false,
  toggle: vi.fn(),
  close: vi.fn(),
  handleSubmitted: vi.fn(),
};
const ref = { current: null };

describe("WriteReviewPanel", () => {
  it("renders nothing for a shopper with no delivered, unreviewed purchase", () => {
    const { container } = render(
      <WriteReviewPanel
        state={{ ...base, orderItemId: null }}
        panelRef={ref}
        productId="p"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("invites, then shows the form inline when opened", () => {
    const { rerender } = render(
      <WriteReviewPanel state={base} panelRef={ref} productId="p" />,
    );
    expect(
      screen.getByRole("button", { name: "Write a review" }),
    ).toHaveAttribute("aria-expanded", "false");
    rerender(
      <WriteReviewPanel
        state={{ ...base, open: true }}
        panelRef={ref}
        productId="p"
      />,
    );
    expect(
      screen.getByRole("form", { name: "review form" }),
    ).toBeInTheDocument();
  });

  it("thanks the shopper once submitted", () => {
    render(
      <WriteReviewPanel
        state={{ ...base, submitted: true }}
        panelRef={ref}
        productId="p"
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      /Thanks for your review/,
    );
  });
});
