"use client";

import { Button } from "@/shared/components/ui/button";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";
import { useUnpaidRazorpayActions } from "../../hooks/actions/useUnpaidRazorpayActions.hook";

interface UnpaidRazorpayActionsProps {
  order: Order;
}

/** Pay now or cancel for a Razorpay order that was left unpaid. */
export function UnpaidRazorpayActions({ order }: UnpaidRazorpayActionsProps) {
  const actions = useUnpaidRazorpayActions(order);

  if (!actions.canResume) return null;

  return (
    <>
      <Button
        type="button"
        className={ordersComponentsStyles.payNowButton}
        loading={actions.paying}
        onClick={() => void actions.payNow()}
      >
        {LABELS.payNow}
      </Button>
      <Button
        type="button"
        variant="outline"
        className={ordersComponentsStyles.cancelButton}
        onClick={() => actions.setOpen(true)}
      >
        {LABELS.cancelOrder}
      </Button>

      <StatusDialog
        open={actions.open}
        onOpenChange={actions.setOpen}
        variant="warning"
        title={LABELS.confirmCancelOrderTitle}
        description={LABELS.confirmCancelUnpaidOrderBody}
        primaryAction={{
          label: LABELS.cancelOrder,
          variant: "destructive",
          loading: actions.cancelling,
          onClick: () => void actions.confirmCancel(),
        }}
        secondaryAction={{
          label: LABELS.keepOrder,
          variant: "outline",
          onClick: () => actions.setOpen(false),
        }}
      />

      {actions.notice ? (
        <p role="status" className={ordersComponentsStyles.cancelSuccess}>
          {actions.notice.description &&
          actions.notice.description !== actions.notice.title
            ? `${actions.notice.title}. ${actions.notice.description}`
            : actions.notice.title}
        </p>
      ) : null}
      {actions.error ? (
        <p role="alert" className={ordersComponentsStyles.cancelError}>
          {actions.error}
        </p>
      ) : null}
    </>
  );
}
