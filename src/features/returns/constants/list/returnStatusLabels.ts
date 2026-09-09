import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";

export const RETURN_STATUS_LABEL: Record<string, string> = {
  [RETURN_STATUS.REQUESTED]: LABELS.returnLogisticsRequested,
  [RETURN_STATUS.APPROVED]: LABELS.returnLogisticsApproved,
  [RETURN_STATUS.REJECTED]: LABELS.returnLogisticsRejected,
  [RETURN_STATUS.PICKUP_SCHEDULED]: LABELS.returnLogisticsPickupScheduled,
  [RETURN_STATUS.RECEIVED]: LABELS.returnLogisticsReceived,
  [RETURN_STATUS.REFUNDED]: LABELS.returnRefundStatusCompleted,
  [RETURN_STATUS.CLOSED]: LABELS.returnLogisticsClosed,
};
