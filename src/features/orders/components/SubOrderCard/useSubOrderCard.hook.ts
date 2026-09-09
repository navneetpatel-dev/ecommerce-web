"use client";

import { useMemo } from "react";
import type { SubOrder } from "@/shared/api/types";
import { ORDER_STATUS } from "@/shared/constants/statuses";
import { buildSubOrderTimeline } from "../../utils/timeline";

interface UseSubOrderCardParams {
  subOrder: SubOrder;
}

export function useSubOrderCard({ subOrder }: UseSubOrderCardParams) {
  const timeline = useMemo(() => {
    return buildSubOrderTimeline(subOrder);
  }, [subOrder]);

  const showTimeline = subOrder.status !== ORDER_STATUS.PENDING;
  const vendorName = subOrder.vendor?.businessName || "Seller";
  const itemCount = subOrder.items?.length ?? 0;
  const canReturn = subOrder.status === ORDER_STATUS.DELIVERED;
  const items = useMemo(() => subOrder.items ?? [], [subOrder.items]);

  return {
    timeline,
    showTimeline,
    vendorName,
    itemCount,
    canReturn,
    items,
  };
}
