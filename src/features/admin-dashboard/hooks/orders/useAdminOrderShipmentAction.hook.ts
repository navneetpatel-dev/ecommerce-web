"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi, ordersKeys } from "@/features/orders";
import {
  mapSubOrdersToShipmentSummaries,
  type OrderShipmentSummary,
} from "@/shared/utils/orders/orderShipmentSummary";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";

export function useAdminOrderShipmentAction(row: AdminDataRow) {
  const [open, setOpen] = useState(false);
  const orderId = String(row.id);

  const detailQuery = useQuery({
    queryKey: ordersKeys.detail(orderId),
    queryFn: () => ordersApi.detail(orderId),
    enabled: open && Boolean(orderId),
  });

  const fallbackShipments = useMemo(
    () => mapSubOrdersToShipmentSummaries(row.subOrders),
    [row.subOrders],
  );

  const shipments: OrderShipmentSummary[] = detailQuery.data
    ? mapSubOrdersToShipmentSummaries(detailQuery.data.subOrders)
    : fallbackShipments;

  const queryClient = useQueryClient();
  const retryRefund = useMutation({
    mutationFn: (subOrderId: string) => ordersApi.retryPartRefund(subOrderId),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(orderId) }),
  });

  const handleRetryRefund = useCallback(
    (subOrderId: string) => {
      retryRefund.mutate(subOrderId);
    },
    [retryRefund],
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
  }, []);

  return {
    open,
    shipments,
    isLoading: open && detailQuery.isLoading && fallbackShipments.length === 0,
    isEmpty: !detailQuery.isLoading && shipments.length === 0,
    handleOpen,
    handleOpenChange,
    handleRetryRefund,
    retryingSubOrderId: retryRefund.isPending
      ? (retryRefund.variables ?? null)
      : null,
    retryError: retryRefund.error
      ? getApiErrorMessage(retryRefund.error, LABELS.partRefundFailed)
      : null,
  };
}
