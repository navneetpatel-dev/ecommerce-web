import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Review } from "@/shared/api/types";
import { ReviewActionsRow } from "../ReviewActionsRow.component";

const review = { id: "r1", helpfulCount: 46, unhelpfulCount: 2 } as Review;
const handlers = () => ({
  onVoteHelpful: vi.fn(),
  onVoteUnhelpful: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
});

describe("ReviewActionsRow", () => {
  it("lets other shoppers vote, with no owner actions", async () => {
    const h = handlers();
    render(<ReviewActionsRow review={review} isMine={false} {...h} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Mark as helpful (46)" }),
    );
    expect(h.onVoteHelpful).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "Edit your review" }),
    ).toBeNull();
  });

  it("shows the author the count as text, with Edit and Delete", async () => {
    const h = handlers();
    render(<ReviewActionsRow review={review} isMine {...h} />);
    expect(screen.getByText("46 found this helpful")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Mark as helpful/ }),
    ).toBeNull();
    await userEvent.click(
      screen.getByRole("button", { name: "Delete your review" }),
    );
    expect(h.onDelete).toHaveBeenCalledTimes(1);
  });
});

describe("ReviewActionsRow — the viewer's own vote", () => {
  it("lights up the chosen vote and says so in words", () => {
    render(
      <ReviewActionsRow
        review={{ ...review, myVote: "HELPFUL" }}
        isMine={false}
        {...handlers()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Mark as helpful (46)" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Mark as not helpful (2)" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("You found this helpful")).toBeInTheDocument();
  });

  it("shows no note before the viewer votes", () => {
    render(<ReviewActionsRow review={review} isMine={false} {...handlers()} />);
    expect(screen.queryByText(/You found this/)).toBeNull();
    expect(screen.queryByText(/You didn't find/)).toBeNull();
  });
});
