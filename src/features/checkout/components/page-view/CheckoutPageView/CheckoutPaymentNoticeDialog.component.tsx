"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/shared/constants/paths/paths";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import type { PaymentNotice } from "../../../hooks/checkout/usePlaceOrder.hook";

interface CheckoutPaymentNoticeDialogProps {
  paymentNotice?: PaymentNotice | null;
  onClearPaymentNotice?: () => void;
}

/** Post-attempt payment notice (success/failure) with a "view cart" escape hatch. */
export function CheckoutPaymentNoticeDialog({
  paymentNotice,
  onClearPaymentNotice,
}: CheckoutPaymentNoticeDialogProps) {
  const router = useRouter();
  const noticePrimaryLabel =
    paymentNotice?.variant === "danger" ? "Try again" : "Continue checkout";

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClearPaymentNotice?.();
    },
    [onClearPaymentNotice],
  );

  const handlePrimaryClick = useCallback(() => {
    onClearPaymentNotice?.();
  }, [onClearPaymentNotice]);

  const handleSecondaryClick = useCallback(() => {
    onClearPaymentNotice?.();
    router.push(PATHS.cart);
  }, [onClearPaymentNotice, router]);

  return (
    <StatusDialog
      open={Boolean(paymentNotice)}
      onOpenChange={handleOpenChange}
      variant={paymentNotice?.variant ?? "info"}
      title={paymentNotice?.title ?? ""}
      description={paymentNotice?.description ?? ""}
      primaryAction={{
        label: noticePrimaryLabel,
        onClick: handlePrimaryClick,
      }}
      secondaryAction={{
        label: "View cart",
        variant: "outline",
        onClick: handleSecondaryClick,
      }}
    />
  );
}
