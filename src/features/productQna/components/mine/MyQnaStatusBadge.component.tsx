import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_QUESTION_STATUS } from "@/shared/constants/statuses";

const STATUS_TEXT: Record<string, string> = {
  [PRODUCT_QUESTION_STATUS.PENDING]: LABELS.reviewStatusPending,
  [PRODUCT_QUESTION_STATUS.PUBLISHED]: LABELS.reviewStatusApproved,
  [PRODUCT_QUESTION_STATUS.REJECTED]: LABELS.reviewStatusRejected,
};

/** "Awaiting approval" / "Published" / "Not published" for a question or answer. */
export function MyQnaStatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return <Badge variant="outline">{STATUS_TEXT[status] ?? status}</Badge>;
}
