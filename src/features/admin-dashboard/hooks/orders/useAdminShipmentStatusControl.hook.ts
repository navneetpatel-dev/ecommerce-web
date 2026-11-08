"use client";

import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersKeys } from "@/features/orders";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  adminShippingApi,
  adminShippingKeys,
  type AdminShipmentStatus,
  type AdminShipmentStatusBody,
} from "../../api/shipping/shipping.api";
import {
  adminShipmentStatusBlocker,
  nextAdminShipmentStatuses,
} from "../../utils/shipping/adminShipmentStatus";

interface UseAdminShipmentStatusControlArgs {
  orderId: string;
  shipmentId: string;
  status: string;
  isCashOnDelivery: boolean;
}

/** Moving one parcel on by hand: delivered (with COD cash or not), failed attempt, RTO, received back. */
export function useAdminShipmentStatusControl({
  orderId,
  shipmentId,
  status,
  isCashOnDelivery,
}: UseAdminShipmentStatusControlArgs) {
  const queryClient = useQueryClient();
  const options = useMemo(() => nextAdminShipmentStatuses(status), [status]);
  const [nextStatus, setNextStatus] = useState<AdminShipmentStatus | null>(
    null,
  );
  const [reason, setReason] = useState("");
  const [codCollected, setCodCollected] = useState(false);

  const update = useMutation({
    mutationFn: (body: AdminShipmentStatusBody) =>
      adminShippingApi.updateShipmentStatus(shipmentId, body),
    onSuccess: () => {
      notifySuccess(LABELS.shipmentStatusUpdated);
      setNextStatus(null);
      setReason("");
      setCodCollected(false);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ordersKeys.detail(orderId),
      });
      void queryClient.invalidateQueries({
        queryKey: adminShippingKeys.rtoQueue,
      });
    },
  });

  const blocker = adminShipmentStatusBlocker({ nextStatus, reason });
  const askReason = nextStatus === "FAILED";
  const askCodCollected = nextStatus === "DELIVERED" && isCashOnDelivery;

  const handleStatusChange = useCallback((value: string) => {
    setNextStatus(value as AdminShipmentStatus);
  }, []);

  const handleReasonChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => setReason(event.target.value),
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!nextStatus || blocker) return;
    update.mutate({
      status: nextStatus,
      ...(askReason ? { reason: reason.trim() } : {}),
      ...(askCodCollected ? { codCollected } : {}),
    });
  }, [
    askCodCollected,
    askReason,
    blocker,
    codCollected,
    nextStatus,
    reason,
    update,
  ]);

  return {
    hasOptions: options.length > 0,
    options,
    nextStatus: nextStatus ?? "",
    reason,
    codCollected,
    askReason,
    askCodCollected,
    canSubmit: blocker === null && !update.isPending,
    isPending: update.isPending,
    error: update.error
      ? getApiErrorMessage(update.error, LABELS.shipmentStatusUpdateFailed)
      : null,
    reasonFieldId: `shipment-failure-reason-${shipmentId}`,
    codFieldId: `shipment-cod-collected-${shipmentId}`,
    handleStatusChange,
    handleReasonChange,
    handleCodCollectedChange: setCodCollected,
    handleSubmit,
  };
}
