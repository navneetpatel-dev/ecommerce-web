"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { useCashbackHistory } from "../api/cashback.queries";

const PAGE_SIZE = 20;

/** The customer's cashback by order, with the server's totals. */
export function useCashbackHistoryPage() {
  const [page, setPage] = useState(1);
  const query = useCashbackHistory({ page, limit: PAGE_SIZE });
  const data = query.data;

  return {
    rows: data?.items ?? [],
    loading: query.isLoading,
    error: query.error
      ? getApiErrorMessage(query.error, LABELS.genericActionFailed)
      : null,
    pendingTotal: data ? formatInr(data.totals.pending) : null,
    creditedTotal: data ? formatInr(data.totals.credited) : null,
    pagination: data
      ? {
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          total: data.pagination.total,
          onPageChange: setPage,
        }
      : undefined,
  };
}
