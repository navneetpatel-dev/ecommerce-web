"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/shared/constants/paths/paths";
import { navigate } from "@/shared/utils/navigation/navigate";
import type { Order } from "@/shared/api/types";
import { reportsEngineApi } from "@/features/reports";
import { defaultHistoryRange } from "../../utils/list/orderHistoryRange";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
}

interface UseOrdersListParams {
  pagination?: PaginationProps;
}

export function useOrdersList({ pagination }: UseOrdersListParams) {
  const router = useRouter();

  const exportHistory = useCallback(() => {
    const range = defaultHistoryRange();
    void reportsEngineApi.customerOrderHistoryExport(range);
  }, []);

  const handleRowClick = useCallback(
    (order: Order) => {
      navigate(router, PATHS.order(order.id));
    },
    [router],
  );

  const getRowId = useCallback((order: Order) => order.id, []);

  const paginationConfig = useMemo(() => {
    if (!pagination) return undefined;
    return {
      page: pagination.currentPage,
      totalPages: pagination.totalPages,
      total: pagination.total,
      from: pagination.from,
      to: pagination.to,
      onPageChange: pagination.onPageChange,
    };
  }, [pagination]);

  return {
    exportHistory,
    handleRowClick,
    getRowId,
    paginationConfig,
  };
}
