"use client";

import { useMemo, useCallback } from "react";
import type {
  SubOrderRow,
  VendorSubOrder,
} from "../../types/orders/vendorOrders.types";
import { SubOrderActions } from "../../components/orders/VendorOrdersTable/SubOrderActions.component";

function flattenSubOrders(orders: VendorSubOrder[]): SubOrderRow[] {
  return orders.map((subOrder) => ({ orderId: subOrder.orderId, subOrder }));
}

interface UseVendorOrdersTableParams {
  orders: VendorSubOrder[];
  updatingId: string | null;
  statusError: string | null;
  statusErrorId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

export function useVendorOrdersTable({
  orders,
  updatingId,
  statusError,
  statusErrorId,
  onSetUpdatingId,
  onStatusChange,
}: UseVendorOrdersTableParams) {
  const rows = useMemo(() => {
    return flattenSubOrders(orders);
  }, [orders]);

  const isEmpty = rows.length === 0;

  const renderActions = useCallback(
    (subOrderId: string, status: string, canDownloadInvoice: boolean) => (
      <SubOrderActions
        subOrderId={subOrderId}
        status={status}
        canDownloadInvoice={canDownloadInvoice}
        updatingId={updatingId}
        statusError={statusErrorId === subOrderId ? statusError : null}
        onSetUpdatingId={onSetUpdatingId}
        onStatusChange={onStatusChange}
      />
    ),
    [updatingId, statusError, statusErrorId, onSetUpdatingId, onStatusChange],
  );

  return {
    rows,
    isEmpty,
    renderActions,
  };
}
