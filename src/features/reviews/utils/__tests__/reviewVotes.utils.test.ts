import { describe, expect, it } from "vitest";
import type { Review } from "@/shared/api/types";
import { nextVote, withViewerVote } from "../reviewVotes.utils";

const review = (myVote: Review["myVote"]) =>
  ({ id: "r1", helpfulCount: 10, unhelpfulCount: 2, myVote }) as Review;

describe("review votes", () => {
  it("clicking your own vote again takes it back", () => {
    expect(nextVote("HELPFUL", "HELPFUL")).toBeNull();
    expect(nextVote("HELPFUL", "UNHELPFUL")).toBe("UNHELPFUL");
    expect(nextVote(null, "HELPFUL")).toBe("HELPFUL");
  });

  it("moves the counts with the vote", () => {
    expect(withViewerVote(review(null), "HELPFUL")).toMatchObject({
      helpfulCount: 11,
      unhelpfulCount: 2,
      myVote: "HELPFUL",
    });
    expect(withViewerVote(review("HELPFUL"), "UNHELPFUL")).toMatchObject({
      helpfulCount: 9,
      unhelpfulCount: 3,
    });
    expect(withViewerVote(review("UNHELPFUL"), null)).toMatchObject({
      helpfulCount: 10,
      unhelpfulCount: 1,
      myVote: null,
    });
  });
});
