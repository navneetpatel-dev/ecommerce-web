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
