"use client";

import { Button } from "@/shared/components/ui/button";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";
import { useOrderCancelAction } from "../../hooks/actions/useOrderCancelAction.hook";

interface OrderCancelActionProps {
  order: Order;
}

export function OrderCancelAction({ order }: OrderCancelActionProps) {
  const {
    canCancel,
    open,
    setOpen,
    message,
    error,
    isPending,
    confirmCancel,
  } = useOrderCancelAction(order);

  if (!canCancel) return null;

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
          loading: isPending,
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
