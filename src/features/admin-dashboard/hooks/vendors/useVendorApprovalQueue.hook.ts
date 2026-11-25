"use client";

import { useCallback } from "react";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import { useVendorApproval } from "./useVendorApproval.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import type { VendorInfo } from "@/shared/api/types";

export function useVendorApprovalQueue() {
  const urlFilters = useUrlFilterParams<"search" | "kycFilter">({
    search: ["q"],
  });
  const search = urlFilters.get("search");
  const kycFilter = urlFilters.get("kycFilter");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      const res = await adminApi.pendingVendors({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      if (!kycFilter) return res;
      const wantComplete = kycFilter === "COMPLETE";
      const filtered = res.items.filter(
        (v) => Boolean(v.kycComplete) === wantComplete,
      );
      return { ...res, items: filtered, total: filtered.length };
    },
    [debouncedSearch, kycFilter],
  );
  const list = useAdminDataList(load);
  const { approve, reject } = useVendorApproval();

  const handleClear = useCallback(() => {
    urlFilters.clearAll(["search", "kycFilter"]);
  }, [urlFilters]);

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
    kycFilter,
    onSearchChange: urlFilters.set("search"),
    onKycFilterChange: urlFilters.set("kycFilter"),
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
