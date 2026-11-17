"use client";

import { useCallback, useState } from "react";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import { useVendorApproval } from "./useVendorApproval.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { VendorInfo } from "@/shared/api/types";

export function useVendorApprovalQueue() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      adminApi.pendingVendors({
        page,
        limit,
        search: debouncedSearch || undefined,
      }),
    [debouncedSearch],
  );
  const list = useAdminDataList(load);
  const { approve, reject } = useVendorApproval();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleClear = () => {
    setSearch("");
  };

  const onApprove = useCallback(
    async (id: string, commissionRate?: number) => {
      await approve.mutateAsync({ id, commissionRate });
      list.reload();
    },
    [approve, list],
  );

  const onReject = useCallback(
    async (id: string, reason: string) => {
      await reject.mutateAsync({ id, reason });
      list.reload();
    },
    [reject, list],
  );

  return {
    vendors: list.rows as unknown as VendorInfo[],
    isLoading: list.loading,
    search,
    onSearchChange: handleSearchChange,
    onClear: handleClear,
    reload: list.reload,
    pagination: {
      page: list.page,
      totalPages: list.totalPages,
      total: list.total,
      from: list.from,
      to: list.to,
      onPageChange: list.onPageChange,
    },
    onApprove,
    onReject,
    isApproving: approve.isPending,
    isRejecting: reject.isPending,
  };
}
