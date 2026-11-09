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
  const list = useAdminCashbackOffers({ page, limit: PAGE_SIZE });
  const remove = useDeleteCashbackOffer();
  const columns = useMemo(() => buildCashbackOfferColumns(), []);
  const data = list.data;

  const handleDelete = useCallback(
    async (id: string) => {
      await remove.mutateAsync(id);
      notifySuccess(LABELS.cashbackOfferDeleted);
    },
    [remove],
  );

  return {
    columns,
    rows: data?.items ?? [],
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
    handleDelete,
  };
}
