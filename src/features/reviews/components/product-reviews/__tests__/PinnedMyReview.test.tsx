import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Review } from "@/shared/api/types";
import { ReviewEditContext } from "../../../context/reviewEdit.context";
import { PinnedMyReview } from "../PinnedMyReview.component";

const review = {
  id: "r1",
  userId: "me",
  rating: 4,
  title: "Good",
  body: "Comfortable and well made overall.",
  status: "PENDING",
  helpfulCount: 0,
  unhelpfulCount: 0,
  createdAt: "2026-11-10T00:00:00Z",
  user: { name: "Karan Verma" },
} as unknown as Review;

describe("PinnedMyReview", () => {
  it("shows the viewer's review tagged, with its status and Edit", () => {
    render(
      <ReviewEditContext.Provider
        value={{
          currentUserId: "me",
          editReview: vi.fn(),
          deleteReview: vi.fn(),
        }}
      >
        <PinnedMyReview
          review={review}
          onVoteHelpful={vi.fn()}
          onVoteUnhelpful={vi.fn()}
        />
      </ReviewEditContext.Provider>,
    );
    expect(screen.getByText("Your review")).toBeInTheDocument();
    expect(screen.getByText("Awaiting approval")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit your review" }),
    ).toBeInTheDocument();
  });

  it("renders nothing when the viewer has no review", () => {
    const { container } = render(
      <PinnedMyReview
        review={null}
        onVoteHelpful={vi.fn()}
        onVoteUnhelpful={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
