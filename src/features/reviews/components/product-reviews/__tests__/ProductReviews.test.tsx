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

describe("ProductReviews", () => {
  it("shows an error with Try again when reviews fail to load", async () => {
    const onRetry = vi.fn();
    render(
      <ProductReviews
        reviews={[]}
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
        onVoteHelpful={onVoteHelpful}
        onVoteUnhelpful={noop}
      />,
    );
    expect(screen.getByText("Works well")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onVoteHelpful).toHaveBeenCalledWith("r1");
  });
});
