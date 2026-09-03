import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { RETURN_STATUS, REFUND_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { returnsApi } from "@/features/returns";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { AdminAssignDeliveryAgentAction } from "../components/AdminAssignDeliveryAgentAction.component";
import { adminRowLabel } from "./adminRowLabel";
import type { AdminDataRow } from "../hooks/useAdminDataList.hook";

export function buildReturnRowActions(
  row: AdminDataRow,
  reload: () => void,
): ReactNode {
  const name = adminRowLabel(row);
  const status = String(row.status ?? "");
  const buttons: ReactNode[] = [];

  if (row.creditNoteNumber) {
    buttons.push(
      <Button
        key="cn"
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void returnsApi.downloadCreditNote(String(row.id))}
      >
        {LABELS.downloadCreditNote}
      </Button>,
    );
  }
  if (row.debitNoteNumber) {
    buttons.push(
      <Button
        key="dn"
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void returnsApi.downloadDebitNote(String(row.id))}
      >
        {LABELS.downloadDebitNote}
      </Button>,
    );
  }

  if (
    row.refundStatus === REFUND_STATUS.FAILED &&
    Number(row.razorpayRefundAmount ?? 0) > 0
  ) {
    buttons.push(
      <AdminConfirmAction
        key="retry-refund"
        label={LABELS.retryRefund}
        dialogVariant="warning"
        title={LABELS.confirmRetryRefundTitle}
        description={formatLabel(LABELS.confirmRetryRefundBody, { name })}
        onConfirm={() => returnsApi.retryRefund(String(row.id)).then(reload)}
      />,
    );
  }

  if (status === RETURN_STATUS.REQUESTED) {
    buttons.push(
      <AdminConfirmAction
        key="approve"
        label={LABELS.approve}
        dialogVariant="success"
        title={LABELS.confirmApproveReturnTitle}
        description={formatLabel(LABELS.confirmApproveReturnBody, { name })}
        onConfirm={() =>
          returnsApi
            .transition(String(row.id), RETURN_STATUS.APPROVED)
            .then(reload)
        }
      />,
    );
  }

  if (status === RETURN_STATUS.APPROVED || status === RETURN_STATUS.REFUNDED) {
    buttons.push(
      <AdminConfirmAction
        key="pickup"
        label={LABELS.returnSchedulePickup}
        dialogVariant="success"
        title={LABELS.confirmSchedulePickupTitle}
        description={formatLabel(LABELS.confirmSchedulePickupBody, {
          name,
        })}
        onConfirm={() =>
          returnsApi
            .transition(String(row.id), RETURN_STATUS.PICKUP_SCHEDULED)
            .then(reload)
        }
      />,
    );
  }

  if (status === RETURN_STATUS.PICKUP_SCHEDULED && !row.deliveryAgentId) {
    buttons.push(
      <AdminAssignDeliveryAgentAction
        key="assign-agent"
        returnId={String(row.id)}
        onDone={reload}
      />,
    );
  }

  if (status === RETURN_STATUS.PICKUP_SCHEDULED) {
    buttons.push(
      <AdminConfirmAction
        key="received"
        label={LABELS.returnMarkReceived}
        dialogVariant="success"
        title={LABELS.confirmMarkReceivedTitle}
        description={formatLabel(LABELS.confirmMarkReceivedBody, { name })}
        onConfirm={() =>
          returnsApi
            .transition(String(row.id), RETURN_STATUS.RECEIVED)
            .then(reload)
        }
      />,
    );
  }

  if (
    status === RETURN_STATUS.RECEIVED ||
    (status === RETURN_STATUS.REFUNDED && row.receivedAt)
  ) {
    buttons.push(
      <AdminConfirmAction
        key="close"
        label={LABELS.returnClose}
        dialogVariant="success"
        title={LABELS.confirmCloseReturnTitle}
        description={formatLabel(LABELS.confirmCloseReturnBody, { name })}
        onConfirm={() =>
          returnsApi
            .transition(String(row.id), RETURN_STATUS.CLOSED)
            .then(reload)
        }
      />,
    );
  }

  buttons.push(
    <AdminConfirmAction
      key="delete"
      label={LABELS.delete}
      dialogVariant="danger"
      tone="danger"
      title={LABELS.confirmDeleteReturnTitle}
      description={formatLabel(LABELS.confirmDeleteReturnBody, { name })}
      onConfirm={() => returnsApi.delete(String(row.id)).then(reload)}
    />,
  );

  return <>{buttons}</>;
}
