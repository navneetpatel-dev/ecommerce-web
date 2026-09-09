import type { ReviewStatus } from "@/shared/constants/statuses";

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
  createdAt: string;
  vendorResponse?: string | null;
  vendorRespondedAt?: string | null;
  user?: { name: string };
  product?: { id: string; name: string; slug: string };
}
