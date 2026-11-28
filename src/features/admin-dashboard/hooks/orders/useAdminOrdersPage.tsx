"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUrlQueryState } from "@/shared/hooks/navigation/useUrlQueryState.hook";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { ordersApi } from "@/features/orders";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import type { AdminOrdersFiltersProps } from "../../components/orders/AdminOrdersFilters.component";
import { useAdminOrderRowActions } from "./useAdminOrderRowActions";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const fetchDetail = useCallback(
    async (row: AdminDataRow) =>
      (await ordersApi.detail(String(row.id))) as unknown as Record<
        string,
        unknown
      >,
    [],
  );
  const actions = useAdminOrderRowActions();

  return {
    title: LABELS.orders,
    permission: PERMISSIONS.ORDER_MANAGE,
    load,
    actions,
    fetchDetail,
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
