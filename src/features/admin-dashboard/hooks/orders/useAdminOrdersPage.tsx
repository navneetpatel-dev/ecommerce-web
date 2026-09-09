"use client";

import { useCallback, useState, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { ORDER_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ordersApi } from "@/features/orders";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import { adminDataListViewStyles } from "../../styles/shared/adminDataListView.styles";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import type { AdminOrdersFiltersProps } from "../../components/orders/AdminOrdersFilters.component";

export type AdminOrdersPageModel = AdminListPageModel & {
  filters: AdminOrdersFiltersProps;
};

interface UseAdminOrdersPageProps {
  initialSearch?: string;
  initialStatus?: string;
}

export function useAdminOrdersPage(
  props: UseAdminOrdersPageProps = {},
): AdminOrdersPageModel {
  const { initialSearch = "", initialStatus = "" } = props;
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      ordersApi.myOrders(page, limit, undefined, {
        status: status || undefined,
        search: debouncedSearch || undefined,
      }),
    [debouncedSearch, status],
  );

  const onClear = useCallback(() => {
    setSearch("");
    setStatus("");
  }, []);

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const isPending = row.status === ORDER_STATUS.PENDING;
      const canCancel =
        row.status !== ORDER_STATUS.CANCELLED &&
        row.status !== ORDER_STATUS.DELIVERED &&
        row.status !== ORDER_STATUS.RETURNED;

      return (
        <div className={adminDataListViewStyles.rowActionsInline}>
          {isPending && (
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
          )}
          {canCancel && (
            <AdminConfirmAction
              label="Cancel"
              dialogVariant="danger"
              confirmVariant="destructive"
              tone="danger"
              title="Cancel Order"
              description={`Are you sure you want to cancel order ${name || row.id}? This will restock items, void ledgers, and trigger refund if already paid.`}
              onConfirm={() => ordersApi.cancel(String(row.id)).then(reload)}
            />
          )}
        </div>
      );
    },
    [],
  );

  return {
    title: LABELS.orders,
    permission: PERMISSIONS.ORDER_MANAGE,
    load,
    actions,
    columnKeys: ["id", "customerName", "status", "totalAmount", "createdAt"],
    filters: {
      search,
      status,
      onSearchChange: setSearch,
      onStatusChange: setStatus,
      onClear,
    },
  };
}
