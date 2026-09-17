"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi, ordersKeys, subOrdersApi } from "@/features/orders";
import { MAX_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import {
  mapSubOrdersToShipmentSummaries,
  type OrderShipmentSummary,
} from "@/shared/utils/orders/orderShipmentSummary";
import type { RoleMode } from "../../utils/detail/ticketThreadShared";

export function useTicketRelatedShipments(
  relatedOrderId: string | null,
  mode: RoleMode,
) {
  const orderId = relatedOrderId?.trim() ?? "";

  const query = useQuery({
    queryKey: [...ordersKeys.detail(orderId), "ticket-shipments", mode],
    enabled: Boolean(orderId),
    queryFn: async (): Promise<OrderShipmentSummary[]> => {
      if (mode === "vendor") {
        const page = await subOrdersApi.vendorSubOrders(1, MAX_PAGE_LIMIT);
        const matching = page.items.filter((row) => {
          const record = row as unknown as { orderId?: unknown };
          return String(record.orderId ?? "") === orderId;
        });
        return mapSubOrdersToShipmentSummaries(matching);
      }

      const order = await ordersApi.detail(orderId);
      return mapSubOrdersToShipmentSummaries(order.subOrders);
    },
  });

  return {
    shipments: query.data ?? [],
    isLoading: query.isLoading,
    isEmpty: !query.isLoading && (query.data?.length ?? 0) === 0,
  };
}
