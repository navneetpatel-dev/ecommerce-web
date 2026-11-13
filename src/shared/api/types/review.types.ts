import type { ReviewStatus } from "@/shared/constants/statuses";

export interface ReviewMediaItem {
  url: string;
  type: "IMAGE" | "VIDEO";
  durationSeconds: number | null;
}

/** Helpful / Not helpful. */
export type ReviewVote = "HELPFUL" | "UNHELPFUL";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderItemId: string;
  rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  helpfulCount: number;
  unhelpfulCount: number;
  /** The signed-in viewer's own vote on this review (null: they have not voted). */
  myVote?: ReviewVote | null;
  createdAt: string;
  /** Photos and at most one video (approved reviews show them). */
  media?: ReviewMediaItem[];
  vendorResponse?: string | null;
  vendorRespondedAt?: string | null;
  editedAt?: string | null;
  user?: { name: string };
  product?: { id: string; name: string; slug: string };
}
