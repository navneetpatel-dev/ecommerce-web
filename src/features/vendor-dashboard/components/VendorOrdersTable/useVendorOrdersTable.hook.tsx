"use client";

import { useMemo, useCallback } from "react";
import type {
  SubOrderRow,
  VendorSubOrder,
} from "../../types/vendorOrders.types";
import { SubOrderActions } from "./SubOrderActions.component";

function flattenSubOrders(orders: VendorSubOrder[]): SubOrderRow[] {
  return orders.map((subOrder) => ({ orderId: subOrder.orderId, subOrder }));
}

interface UseVendorOrdersTableParams {
  orders: VendorSubOrder[];
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

export function useVendorOrdersTable({
  orders,
  updatingId,
  onSetUpdatingId,
  onStatusChange,
}: UseVendorOrdersTableParams) {
  const rows = useMemo(() => {
    return flattenSubOrders(orders);
  }, [orders]);

  const isEmpty = rows.length === 0;

  const renderActions = useCallback(
    (subOrderId: string, canDownloadInvoice: boolean) => (
      <SubOrderActions
        subOrderId={subOrderId}
        canDownloadInvoice={canDownloadInvoice}
        updatingId={updatingId}
        onSetUpdatingId={onSetUpdatingId}
        onStatusChange={onStatusChange}
      />
    ),
    [updatingId, onSetUpdatingId, onStatusChange],
  );

  return {
    rows,
    isEmpty,
    renderActions,
  };
}
