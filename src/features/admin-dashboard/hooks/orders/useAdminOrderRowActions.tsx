"use client";

import { CircleX } from "lucide-react";
import { useCallback, type ReactNode } from "react";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ordersApi } from "@/features/orders";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminOrderShipmentAction } from "../../components/orders/AdminOrderShipmentAction";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";

/** What an admin can do with one order row: its shipment, confirming and cancelling. */
export function useAdminOrderRowActions() {
  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      // An online order is confirmed by its payment, never by hand before it lands.
      const awaitingPayment =
        row.paymentMethod === PAYMENT_METHOD.RAZORPAY &&
        row.paymentStatus === PAYMENT_STATUS.PENDING;
      const isPending = row.status === ORDER_STATUS.PENDING && !awaitingPayment;
      // Once a part has shipped the order can't be cancelled whole.
      const canCancel =
        row.status !== ORDER_STATUS.CANCELLED &&
        row.status !== ORDER_STATUS.SHIPPED &&
        row.status !== ORDER_STATUS.DELIVERED &&
        row.status !== ORDER_STATUS.RETURNED;
      const confirmOrder = () =>
        ordersApi
          .updateStatus(String(row.id), ORDER_STATUS.CONFIRMED)
          .then(reload);
      const cancelOrder = () => ordersApi.cancel(String(row.id)).then(reload);

      return (
        <>
          <AdminOrderShipmentAction row={row} />
          {isPending && (
            <AdminConfirmAction
              label={LABELS.confirm}
              dialogVariant="success"
              tone="success"
              title={LABELS.confirmOrderTitle}
              description={formatLabel(LABELS.confirmOrderBody, { name })}
              onConfirm={confirmOrder}
            />
          )}
          {canCancel && (
            <AdminConfirmAction
              label={LABELS.cancelOrder}
              icon={CircleX}
              dialogVariant="danger"
              tone="danger"
              title={LABELS.confirmCancelOrderTitle}
              description={LABELS.confirmCancelOrderBody}
              onConfirm={cancelOrder}
            />
          )}
        </>
      );
    },
    [],
  );

  return actions;
}
