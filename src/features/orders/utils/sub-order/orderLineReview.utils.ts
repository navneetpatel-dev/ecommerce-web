import { LABELS } from "@/shared/constants/labels";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import type { OrderItem } from "@/shared/api/types";

const STATUS_LABEL: Record<string, string> = {
  [REVIEW_STATUS.PENDING]: LABELS.reviewStatusPending,
  [REVIEW_STATUS.APPROVED]: LABELS.reviewStatusApproved,
  [REVIEW_STATUS.REJECTED]: LABELS.reviewStatusRejected,
};

export function reviewStatusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

/** A line the buyer can review right now (server-decided, product still known). */
export function isReviewableLine(item: OrderItem): boolean {
  return Boolean(item.canReview && item.productId);
}
