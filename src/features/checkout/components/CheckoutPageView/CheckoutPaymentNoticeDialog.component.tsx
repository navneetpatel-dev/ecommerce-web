"use client";

import { useRouter } from "next/navigation";
import { PATHS } from "@/shared/constants/paths";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import type { PaymentNotice } from "../../hooks/usePlaceOrder.hook";

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

  return (
    <StatusDialog
      open={Boolean(paymentNotice)}
      onOpenChange={(open) => {
        if (!open) onClearPaymentNotice?.();
      }}
      variant={paymentNotice?.variant ?? "info"}
      title={paymentNotice?.title ?? ""}
      description={paymentNotice?.description ?? ""}
      primaryAction={{
        label: noticePrimaryLabel,
        onClick: () => onClearPaymentNotice?.(),
      }}
      secondaryAction={{
        label: "View cart",
        variant: "outline",
        onClick: () => {
          onClearPaymentNotice?.();
          router.push(PATHS.cart);
        },
      }}
    />
  );
}
