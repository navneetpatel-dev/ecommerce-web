import { describe, expect, it } from "vitest";
import { QueryClient, type InfiniteData } from "@tanstack/react-query";
import type { PaginatedList } from "@/shared/api/client/pagination";
import type { Review } from "@/shared/api/types";
import type { ProductReviewPage } from "../../../types/productReviews.types";
import { updateReviewInCaches } from "../reviewCache";

const review = (
  id: string,
  rating: number,
  extra: Partial<Review> = {},
): Review => ({
  id,
  productId: "p1",
  userId: `u-${id}`,
  orderItemId: `oi-${id}`,
  rating,
  title: null,
  body: `body ${id}`,
  status: "APPROVED",
  helpfulCount: 0,
  unhelpfulCount: 0,
  createdAt: "2026-11-01T00:00:00.000Z",
  ...extra,
});

const pageKey = ["reviews", "product", "p1", { sort: "helpful" }];
const mineKey = ["reviews", "mine"];

function setup(items: Review[], myReview: Review | null = null) {
  const qc = new QueryClient();
  qc.setQueryData<ProductReviewPage>(pageKey, {
    items,
    total: items.length,
    page: 1,
    limit: 10,
    totalPages: 1,
    myReview,
    summary: {
      total: 3,
      average: 4,
      distribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 },
      withMedia: 0,
    },
  });
  return qc;
}

const read = (qc: QueryClient) => qc.getQueryData<ProductReviewPage>(pageKey)!;

describe("updateReviewInCaches — the list never re-orders", () => {
  it("a vote changes counts in place, even under Most helpful", () => {
    const qc = setup([
      review("r1", 5, { helpfulCount: 9 }),
      review("r2", 4),
      review("r3", 3),
    ]);
    updateReviewInCaches(qc, "r3", (r) => ({ ...r, helpfulCount: 50 }));
    expect(read(qc).items.map((r) => r.id)).toEqual(["r1", "r2", "r3"]);
    expect(read(qc).items[2].helpfulCount).toBe(50);
  });

  it("an edit (now pending) stays where it was", () => {
    const qc = setup([review("r1", 5), review("r2", 4)]);
    updateReviewInCaches(qc, "r1", (r) => ({
      ...r,
      body: "edited",
      status: "PENDING",
    }));
    expect(read(qc).items.map((r) => r.id)).toEqual(["r1", "r2"]);
    expect(read(qc).items[0]).toMatchObject({
      body: "edited",
      status: "PENDING",
    });
  });

  it("deleting my pinned review clears it and takes its stars out of the summary", () => {
    const mine = review("r3", 3);
    const qc = setup([review("r1", 5), review("r2", 4)], mine);
    updateReviewInCaches(qc, "r3", () => null);
    const data = read(qc);
    expect(data.items.map((r) => r.id)).toEqual(["r1", "r2"]);
    expect(data.myReview).toBeNull();
    expect(data.summary).toMatchObject({ total: 2, average: 4.5 });
    expect(data.summary.distribution[3]).toBe(0);
  });

  it("removes only that review from My Reviews pages", () => {
    const qc = setup([]);
    qc.setQueryData<InfiniteData<PaginatedList<Review>>>(mineKey, {
      pageParams: [1],
      pages: [
        {
          items: [review("r1", 5), review("r2", 4), review("r3", 3)],
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      ],
    });
    updateReviewInCaches(qc, "r2", () => null);
    const data = qc.getQueryData<InfiniteData<PaginatedList<Review>>>(mineKey)!;
    expect(data.pages[0].items.map((r) => r.id)).toEqual(["r1", "r3"]);
    expect(data.pages[0].total).toBe(2);
  });
});
