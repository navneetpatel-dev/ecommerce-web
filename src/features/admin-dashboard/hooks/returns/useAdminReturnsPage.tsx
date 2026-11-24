"use client";

import { useCallback, useState } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { returnsApi } from "@/features/returns";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { buildReturnRowActions } from "../../utils/returns/returnRowActions";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import type { AdminReturnsFiltersProps } from "../../components/returns/AdminReturnsFilters.component";

export type AdminReturnsPageModel = AdminListPageModel & {
  filters: AdminReturnsFiltersProps;
};

export function useAdminReturnsPage(): AdminReturnsPageModel {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      returnsApi.listAdmin({
        page,
        limit,
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
    (row: AdminDataRow, reload: () => void) =>
      buildReturnRowActions(row, reload),
    [],
  );

  const fetchDetail = useCallback(
    async (row: AdminDataRow) =>
      (await returnsApi.get(String(row.id))) as unknown as Record<
        string,
        unknown
      >,
    [],
  );

  return {
    title: LABELS.returnsRefunds,
    permission: PERMISSIONS.ORDER_REFUND,
    load,
    actions,
    fetchDetail,
    columnKeys: [
      "returnReference",
      "orderReference",
      "productName",
      "customerName",
      "reasonCode",
      "type",
      "status",
      "refundStatus",
      "disputeStatus",
      "refundAmount",
      "creditNoteNumber",
      "debitNoteNumber",
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
