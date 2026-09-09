"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useCancelOrder } from "../../api/orders/orders.queries";
import { canCancelOrder } from "../../utils/actions/orderCancel.utils";
import type { Order } from "@/shared/api/types";
import { ordersComponentsStyles } from "./ordersComponents.styles";

interface OrderCancelActionProps {
  order: Order;
}

export function OrderCancelAction({ order }: OrderCancelActionProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelMutation = useCancelOrder(order.id);

  if (!canCancelOrder(order)) return null;

  const confirmCancel = async () => {
    setError(null);
    setMessage(null);
    try {
      await cancelMutation.mutateAsync();
      setMessage(LABELS.orderCancelledSuccess);
      setOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.orderCancelFailed));
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={ordersComponentsStyles.cancelButton}
        onClick={() => setOpen(true)}
      >
        {LABELS.cancelOrder}
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={setOpen}
        variant="warning"
        title={LABELS.confirmCancelOrderTitle}
        description={LABELS.confirmCancelOrderBody}
        primaryAction={{
          label: LABELS.cancelOrder,
          variant: "destructive",
          loading: cancelMutation.isPending,
          onClick: () => void confirmCancel(),
        }}
        secondaryAction={{
          label: LABELS.cancel,
          variant: "outline",
          onClick: () => setOpen(false),
        }}
      />

      {message ? (
        <p className={ordersComponentsStyles.cancelSuccess}>{message}</p>
      ) : null}
      {error ? (
        <p className={ordersComponentsStyles.cancelError}>{error}</p>
      ) : null}
    </>
  );
}
