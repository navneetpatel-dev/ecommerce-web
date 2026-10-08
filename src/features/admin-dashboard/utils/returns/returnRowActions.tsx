import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  RETURN_STATUS,
  REFUND_STATUS,
  type ReturnStatus,
} from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { returnsApi } from "@/features/returns";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminAssignDeliveryAgentAction } from "../../components/delivery-agents/AdminAssignDeliveryAgentAction.component";
import { adminRowLabel } from "../shared/adminRowLabel";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

export function buildReturnRowActions(
  row: AdminDataRow,
  reload: () => void,
): ReactNode {
  const name = adminRowLabel(row);
  const status = String(row.status ?? "");
  const buttons: ReactNode[] = [];

  const transitionTo = (next: ReturnStatus) => () =>
    returnsApi.transition(String(row.id), next).then(reload);

  const handleRejectReturn = (reason?: string) =>
    returnsApi
      .transition(String(row.id), RETURN_STATUS.REJECTED, reason)
      .then(reload);

  const handleDownloadCreditNote = () => {
    void returnsApi
      .downloadCreditNote(String(row.id))
      .catch((error: unknown) => {
        notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
      });
  };

  const handleDownloadDebitNote = () => {
    void returnsApi
      .downloadDebitNote(String(row.id))
      .catch((error: unknown) => {
        notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
      });
  };

  const handleRetryRefund = () =>
    returnsApi.retryRefund(String(row.id)).then(reload);

  const handleApproveReturn = transitionTo(RETURN_STATUS.APPROVED);
  const handleSchedulePickup = transitionTo(RETURN_STATUS.PICKUP_SCHEDULED);
  const handleMarkReceived = transitionTo(RETURN_STATUS.RECEIVED);
  const handleCloseReturn = transitionTo(RETURN_STATUS.CLOSED);

  const handleDeleteReturn = () =>
    returnsApi.delete(String(row.id)).then(reload);

  if (row.creditNoteNumber) {
    buttons.push(
      <Button
        key="cn"
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadCreditNote}
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
        onClick={handleDownloadDebitNote}
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
        onConfirm={handleRetryRefund}
      />,
    );
  }

  if (status === RETURN_STATUS.REQUESTED) {
    buttons.push(
      <AdminConfirmAction
        key="reject"
        label={LABELS.reject}
        dialogVariant="danger"
        tone="danger"
        title={LABELS.confirmRejectReturnTitle}
        description={formatLabel(LABELS.confirmRejectReturnBody, { name })}
        requireReason
        onConfirm={handleRejectReturn}
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
        onConfirm={handleApproveReturn}
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
        onConfirm={handleSchedulePickup}
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
        onConfirm={handleMarkReceived}
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
        onConfirm={handleCloseReturn}
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
      onConfirm={handleDeleteReturn}
    />,
  );

  return <>{buttons}</>;
}
