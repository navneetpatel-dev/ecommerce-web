"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi, ordersKeys } from "@/features/orders";
import {
  mapSubOrdersToShipmentSummaries,
  type OrderShipmentSummary,
} from "@/shared/utils/orders/orderShipmentSummary";
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
  };
}
