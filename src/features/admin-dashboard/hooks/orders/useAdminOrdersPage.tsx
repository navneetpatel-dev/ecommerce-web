"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useUrlQueryState } from "@/shared/hooks/navigation/useUrlQueryState.hook";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ordersApi } from "@/features/orders";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminOrderShipmentAction } from "../../components/orders/AdminOrderShipmentAction";
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
  const searchParams = useSearchParams();
  const { update } = useUrlQueryState();

  const urlSearch = searchParams.get("search") ?? "";
  const urlStatus = searchParams.get("status") ?? "";

  const { initialSearch = urlSearch, initialStatus = urlStatus } = props;
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  // Sync from URL changes (e.g. browser back/forward)
  useEffect(() => {
    const nextSearch = searchParams.get("search") ?? "";
    const nextStatus = searchParams.get("status") ?? "";
    setSearch((prev) =>
      prev.trim() !== nextSearch.trim() ? nextSearch : prev,
    );
    setStatus((prev) => (prev !== nextStatus ? nextStatus : prev));
  }, [searchParams]);

  // Sync to URL only when active filters actually differ from URL parameters
  useEffect(() => {
    const currentSearch = (searchParams.get("search") ?? "").trim();
    const currentStatus = (searchParams.get("status") ?? "").trim();
    const targetSearch = debouncedSearch.trim();
    const targetStatus = status.trim();

    if (currentSearch !== targetSearch || currentStatus !== targetStatus) {
      update({
        search: targetSearch || undefined,
        status: targetStatus || undefined,
      });
    }
  }, [debouncedSearch, status, searchParams, update]);

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
    update({ search: undefined, status: undefined });
  }, [update]);
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
        <div className={adminDataListViewStyles.rowActionsInline}>
          <AdminOrderShipmentAction row={row} />
          {isPending && (
            <AdminConfirmAction
              label={LABELS.confirm}
              dialogVariant="info"
              tone="success"
              title={LABELS.confirmOrderTitle}
              description={formatLabel(LABELS.confirmOrderBody, { name })}
              onConfirm={confirmOrder}
            />
          )}
          {canCancel && (
            <AdminConfirmAction
              label={LABELS.cancelOrder}
              dialogVariant="danger"
              confirmVariant="destructive"
              tone="danger"
              title={LABELS.confirmCancelOrderTitle}
              description={LABELS.confirmCancelOrderBody}
              onConfirm={cancelOrder}
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
    columnKeys: [
      "orderReference",
      "customerName",
      "status",
      "totalAmount",
      "createdAt",
    ],
    filters: {
      search,
      status,
      onSearchChange: setSearch,
      onStatusChange: setStatus,
      onClear,
    },
  };
}
