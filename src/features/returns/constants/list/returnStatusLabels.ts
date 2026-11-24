import { LABELS } from "@/shared/constants/labels";
import { RETURN_REASON, RETURN_STATUS } from "@/shared/constants/statuses";

export const RETURN_STATUS_LABEL: Record<string, string> = {
  [RETURN_STATUS.REQUESTED]: LABELS.returnLogisticsRequested,
  [RETURN_STATUS.APPROVED]: LABELS.returnLogisticsApproved,
  [RETURN_STATUS.REJECTED]: LABELS.returnLogisticsRejected,
  [RETURN_STATUS.PICKUP_SCHEDULED]: LABELS.returnLogisticsPickupScheduled,
  [RETURN_STATUS.RECEIVED]: LABELS.returnLogisticsReceived,
  [RETURN_STATUS.REFUNDED]: LABELS.returnRefundStatusCompleted,
  [RETURN_STATUS.CLOSED]: LABELS.returnLogisticsClosed,
};

export const RETURN_REASON_LABEL: Record<string, string> = {
  [RETURN_REASON.DAMAGED]: LABELS.returnReasonDamaged,
  [RETURN_REASON.WRONG_ITEM]: LABELS.returnReasonWrongItem,
  [RETURN_REASON.NOT_AS_DESCRIBED]: LABELS.returnReasonNotAsDescribed,
  [RETURN_REASON.NO_LONGER_NEEDED]: LABELS.returnReasonNoLongerNeeded,
  [RETURN_REASON.OTHER]: LABELS.returnReasonOther,
};

export function formatReturnReason(
  reasonCode: string | null | undefined,
): string {
  if (!reasonCode) return "—";
  return RETURN_REASON_LABEL[reasonCode] ?? reasonCode.replaceAll("_", " ");
}
