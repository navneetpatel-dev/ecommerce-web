"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAdminCashbackOffers,
  useDeleteCashbackOffer,
} from "@/features/cashback";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { buildCashbackOfferColumns } from "../../utils/cashback-offers/cashbackOfferColumns";

const PAGE_SIZE = 20;

/** Admin list of platform cashback offers, with paging and delete. */
export function useAdminCashbackOffersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const list = useAdminCashbackOffers({ page, limit: PAGE_SIZE });
  const remove = useDeleteCashbackOffer();
  const columns = useMemo(() => buildCashbackOfferColumns(), []);
  const data = list.data;

  const filteredRows = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      if (
        search.trim() &&
        !item.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      if (status === "ACTIVE" && !item.isActive) return false;
      if (status === "INACTIVE" && item.isActive) return false;
      return true;
    });
  }, [data?.items, search, status]);

  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);
  const handleClear = () => {
    setSearch("");
    setStatus("");
  };

  const handleDelete = useCallback(
    async (id: string) => {
      await remove.mutateAsync(id);
      notifySuccess(LABELS.cashbackOfferDeleted);
    },
    [remove],
  );

  return {
    columns,
    rows: filteredRows,
    loading: list.isLoading,
    refreshing: list.isFetching && !list.isLoading,
    error: list.error
      ? getApiErrorMessage(list.error, LABELS.genericActionFailed)
      : null,
    pagination: data
      ? {
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
          onPageChange: setPage,
        }
      : undefined,
    filters: {
      search,
      status,
      activeCount,
      onSearchChange: setSearch,
      onStatusChange: setStatus,
      onClear: handleClear,
    },
    handleDelete,
  };
}
