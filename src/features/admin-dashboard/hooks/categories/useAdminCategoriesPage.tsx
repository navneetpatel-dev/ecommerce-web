"use client";

import { useCallback, useState } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { categoriesApi } from "@/features/categories";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import type { Category } from "@/shared/api/types";
import { useCategoryCreateDialog } from "./useCategoryCreateDialog.hook";
import { useCategoryRowActions } from "./useCategoryRowActions";

export function useAdminCategoriesPage() {
  const urlFilters = useUrlFilterParams<"search" | "status">({ search: ["q"] });
  const search = urlFilters.get("search");
  const status = urlFilters.get("status");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [listVersion, setListVersion] = useState(0);
  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion;
      return categoriesApi.listPaginated({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status || undefined,
      });
    },
    [listVersion, debouncedSearch, status],
  );

  const list = useAdminDataList(load);
  const refresh = useCallback(
    () => setListVersion((version) => version + 1),
    [],
  );
  const createDialog = useCategoryCreateDialog(refresh);
  const renderActions = useCategoryRowActions(list.reload);

  return {
    ...createDialog,
    title: LABELS.categories,
    permission: PERMISSIONS.CATEGORY_MANAGE,
    categories: list.rows as unknown as Category[],
    loading: list.loading,
    error: list.error,
    reload: list.reload,
    pagination: {
      page: list.page,
      totalPages: list.totalPages,
      total: list.total,
      from: list.from,
      to: list.to,
      onPageChange: list.onPageChange,
    },
    renderActions,
    filters: {
      search,
      status,
      onSearchChange: urlFilters.set("search"),
      onStatusChange: urlFilters.set("status"),
      onClear: () => urlFilters.clearAll(["search", "status"]),
    },
  };
}
