"use client";

import { useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { returnsApi } from "@/features/returns";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { adminRowLabel } from "../utils/adminRowLabel";
import type { AdminDataRow } from "./useAdminDataList.hook";
import type { AdminListPageModel } from "../types/adminListPage.types";

export function useAdminReturnsPage(): AdminListPageModel {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      returnsApi.listAdmin({ page, limit }),
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const status = String(row.status ?? "");
      const buttons: ReactNode[] = [];

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

      if (
        status === RETURN_STATUS.APPROVED ||
        status === RETURN_STATUS.REFUNDED
      ) {
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
    },
    [],
  );

  return {
    title: LABELS.returnsRefunds,
    permission: PERMISSIONS.ORDER_REFUND,
    load,
    actions,
    columnKeys: [
      "productName",
      "customerName",
      "reasonCode",
      "status",
      "refundStatus",
      "refundAmount",
      "createdAt",
    ],
  };
}
