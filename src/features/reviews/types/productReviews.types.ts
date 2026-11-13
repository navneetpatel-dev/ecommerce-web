import type { PaginatedList } from "@/shared/api/client/pagination";
import type { Review } from "@/shared/api/types";

export type ReviewSort = "helpful" | "recent" | "highest" | "lowest";
export type RatingValue = 1 | 2 | 3 | 4 | 5;

/** Star breakdown over every public review of a product (filters never narrow it). */
export interface ReviewSummary {
  total: number;
  average: number;
  distribution: Record<RatingValue, number>;
  withMedia: number;
}

export interface ProductReviewsParams {
  page?: number;
  limit?: number;
  rating?: RatingValue;
  withMedia?: boolean;
  sort?: ReviewSort;
}

export type ProductReviewPage = PaginatedList<Review> & {
  summary: ReviewSummary;
  /** The signed-in viewer's own review of this product, in any moderation state. */
  myReview: Review | null;
};

/** A delivered product the shopper has not reviewed yet (latest delivery). */
export interface AwaitingReviewItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  orderItemId: string;
  orderId: string;
  deliveredAt: string;
}

/** One bar of the star breakdown, ready to render. */
export interface RatingRow {
  rating: RatingValue;
  count: number;
  percent: number;
}
