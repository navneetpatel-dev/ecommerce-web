import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Review } from "@/shared/api/types";
import { ProductReviews } from "../ProductReviews.component";

const review = {
  id: "r1",
  rating: 5,
  title: "Great",
  body: "Works well",
  status: "APPROVED",
  helpfulCount: 2,
  unhelpfulCount: 0,
  user: { id: "u1", name: "Asha" },
} as unknown as Review;

const noop = vi.fn();

const emptySummary = {
  total: 0,
  average: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  withMedia: 0,
};
const oneReviewSummary = {
  ...emptySummary,
  total: 1,
  average: 5,
  distribution: { ...emptySummary.distribution, 5: 1 },
};
const sectionProps = {
  allReviewsHref: "/products/tee/reviews",
  viewAllLabel: "View all 1 reviews",
  hasMore: false,
  ratingHref: (rating: number) => `/products/tee/reviews?rating=${rating}`,
};

describe("ProductReviews", () => {
  it("shows an error with Try again when reviews fail to load", async () => {
    const onRetry = vi.fn();
    render(
      <ProductReviews
        reviews={[]}
        summary={emptySummary}
        {...sectionProps}
        isError
        onRetry={onRetry}
        onVoteHelpful={noop}
        onVoteUnhelpful={noop}
      />,
    );
    expect(screen.getByText("Reviews could not be loaded")).toBeInTheDocument();
    expect(screen.queryByText("No reviews yet")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows No reviews yet only for an empty list that loaded", () => {
    render(
      <ProductReviews
        reviews={[]}
        summary={emptySummary}
        {...sectionProps}
        onVoteHelpful={noop}
        onVoteUnhelpful={noop}
      />,
    );
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("lists reviews and votes on the right one", async () => {
    const onVoteHelpful = vi.fn();
    render(
      <ProductReviews
        reviews={[review]}
        summary={oneReviewSummary}
        {...sectionProps}
        onVoteHelpful={onVoteHelpful}
        onVoteUnhelpful={noop}
      />,
    );
    expect(screen.getByText("Works well")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Mark as helpful (2)" }),
    );
    expect(onVoteHelpful).toHaveBeenCalledWith("r1");
  });

  it("links to every review only when there are more than the preview shows", () => {
    const { rerender } = render(
      <ProductReviews
        reviews={[review]}
        summary={oneReviewSummary}
        {...sectionProps}
        onVoteHelpful={noop}
        onVoteUnhelpful={noop}
      />,
    );
    expect(screen.queryByRole("link", { name: /View all/ })).toBeNull();
    rerender(
      <ProductReviews
        reviews={[review]}
        summary={{ ...oneReviewSummary, total: 40 }}
        {...sectionProps}
        viewAllLabel="View all 40 reviews"
        hasMore
        onVoteHelpful={noop}
        onVoteUnhelpful={noop}
      />,
    );
    expect(
      screen.getByRole("link", { name: "View all 40 reviews" }),
    ).toHaveAttribute("href", "/products/tee/reviews");
  });
});
