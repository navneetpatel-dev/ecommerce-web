"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportsEngineApi } from "@/features/reports";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  SUB_ORDER_STATUS_SHIPPED,
  SUB_ORDER_STATUS_CANCELLED,
  SUB_ORDER_NEXT_STATUSES,
  SUB_ORDER_CANCELLABLE_STATUSES,
} from "../../constants/orders/subOrderStatuses";

interface UseSubOrderActionsParams {
  subOrderId: string;
  status: string;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

/** State and handlers for a vendor sub-order row's status editor. */
export function useSubOrderActions({
  subOrderId,
  status,
  updatingId,
  onSetUpdatingId,
  onStatusChange,
}: UseSubOrderActionsParams) {
  const isEditing = updatingId === subOrderId;
  const [invoicePending, setInvoicePending] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [pendingShipment, setPendingShipment] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Only offer moves the backend accepts; final statuses get no editor at all.
  const nextStatuses = SUB_ORDER_NEXT_STATUSES[status] ?? [];
  const canEditStatus = nextStatuses.length > 0;
  const canCancel = SUB_ORDER_CANCELLABLE_STATUSES.has(status);
  const shipOnly =
    nextStatuses.length === 1 && nextStatuses[0] === SUB_ORDER_STATUS_SHIPPED;
  const otherStatuses = nextStatuses.filter(
    (next) => next !== SUB_ORDER_STATUS_SHIPPED,
  );
  const canShip = nextStatuses.includes(SUB_ORDER_STATUS_SHIPPED);

  const handleStatusSelect = (value: string) => {
    if (value === SUB_ORDER_STATUS_SHIPPED) {
      setPendingShipment(true);
      return;
    }
    onStatusChange(subOrderId, value);
  };

  const beginShipment = () => {
    setPendingShipment(true);
  };

  const confirmShipment = () => {
    const trimmed = trackingId.trim();
    if (!trimmed) return;
    onStatusChange(subOrderId, SUB_ORDER_STATUS_SHIPPED, trimmed);
  };

  const confirmCancel = () => {
    onStatusChange(subOrderId, SUB_ORDER_STATUS_CANCELLED);
  };

  const startEditing = () => {
    setPendingShipment(false);
    setTrackingId("");
    onSetUpdatingId(subOrderId);
  };

  const cancelEditing = () => {
    setPendingShipment(false);
    setTrackingId("");
    onSetUpdatingId(null);
  };

  const downloadInvoice = async () => {
    setInvoicePending(true);
    setInvoiceError(null);
    try {
      await reportsEngineApi.vendorSubOrderInvoice(subOrderId);
    } catch (err) {
      setInvoiceError(getApiErrorMessage(err, LABELS.genericActionFailed));
    } finally {
      setInvoicePending(false);
    }
  };
  const handleDownloadInvoice = () => {
    void downloadInvoice();
  };

  return {
    isEditing,
    invoicePending,
    invoiceError,
    pendingShipment,
    trackingId,
    setTrackingId,
    nextStatuses,
    otherStatuses,
    shipOnly,
    canShip,
    canEditStatus,
    canCancel,
    handleStatusSelect,
    beginShipment,
    confirmShipment,
    confirmCancel,
    startEditing,
    cancelEditing,
    handleDownloadInvoice,
  };
}
