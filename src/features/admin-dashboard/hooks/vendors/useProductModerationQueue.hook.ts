"use client";

import { useCallback, useState } from "react";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import { useProductModeration } from "./useProductModeration.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { ProductDetail } from "@/shared/api/types";

export function useProductModerationQueue() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      adminApi.pendingProducts({
        page,
        limit,
        search: debouncedSearch || undefined,
      }),
    [debouncedSearch],
  );
  const list = useAdminDataList(load);
  const { approve, reject } = useProductModeration();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleClear = () => {
    setSearch("");
  };

  const onApprove = useCallback(
    async (id: string) => {
      await approve.mutateAsync(id);
      list.reload();
    },
    [approve, list],
  );

  const onReject = useCallback(
    async (id: string, note: string) => {
      await reject.mutateAsync({ id, note });
      list.reload();
    },
    [reject, list],
  );

  return {
    products: list.rows as unknown as ProductDetail[],
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
