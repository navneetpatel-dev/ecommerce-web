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

function renderPinned(ownReview: Review) {
  return render(
    <ReviewEditContext.Provider
      value={{
        currentUserId: "me",
        editReview: vi.fn(),
        deleteReview: vi.fn(),
      }}
    >
      <PinnedMyReview
        review={ownReview}
        onVoteHelpful={vi.fn()}
        onVoteUnhelpful={vi.fn()}
      />
    </ReviewEditContext.Provider>,
  );
}

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

describe("PinnedMyReview — an edit of an approved review", () => {
  const approved = {
    ...review,
    status: "APPROVED",
    rating: 5,
    title: "Great",
    body: "The approved text shoppers see.",
  } as Review;

  it("shows the author their waiting edit, tagged, with the note", () => {
    renderPinned({
      ...approved,
      pendingRevision: {
        rating: 2,
        title: "Changed my mind",
        body: "My edited text, awaiting approval.",
        media: [],
        submittedAt: "2026-11-15T00:00:00Z",
      },
    });
    expect(
      screen.getByText("My edited text, awaiting approval."),
    ).toBeInTheDocument();
    expect(screen.queryByText("The approved text shoppers see.")).toBeNull();
    expect(screen.getByText("Edit awaiting approval")).toBeInTheDocument();
    expect(
      screen.getByText(/Shoppers still see your previous version/),
    ).toBeInTheDocument();
  });

  it("says when the last edit was declined, showing the live version", () => {
    renderPinned({ ...approved, revisionRejectedAt: "2026-11-15T00:00:00Z" });
    expect(
      screen.getByText("The approved text shoppers see."),
    ).toBeInTheDocument();
    expect(screen.getByText(/last edit wasn't approved/)).toBeInTheDocument();
  });
});
