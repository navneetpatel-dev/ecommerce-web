"use client";

import { useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { ORDER_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { ordersApi } from "@/features/orders";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { adminRowLabel } from "../utils/adminRowLabel";
import type { AdminDataRow } from "./useAdminDataList.hook";
import type { AdminListPageModel } from "../types/adminListPage.types";

export function useAdminOrdersPage(): AdminListPageModel {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      ordersApi.myOrders(page, limit),
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      return (
        <AdminConfirmAction
          label={LABELS.confirm}
          dialogVariant="info"
          tone="success"
          title={LABELS.confirmOrderTitle}
          description={formatLabel(LABELS.confirmOrderBody, { name })}
          onConfirm={() =>
            ordersApi
              .updateStatus(String(row.id), ORDER_STATUS.CONFIRMED)
              .then(reload)
          }
        />
      );
    },
    [],
  );

  return {
    title: LABELS.orders,
    permission: PERMISSIONS.ORDER_MANAGE,
    load,
    actions,
    columnKeys: ["customerName", "status", "totalAmount", "createdAt"],
  };
}
