"use client";

import { Loader2 } from "lucide-react";
import { PAYMENT_PROCESSING_OVERLAY_STYLES } from "../../styles/payment/paymentProcessingOverlay.styles";

interface PaymentProcessingOverlayProps {
  open: boolean;
  title: string;
  description?: string;
}

export function PaymentProcessingOverlay({
  open,
  title,
  description,
}: PaymentProcessingOverlayProps) {
  if (!open) return null;

  return (
    <div
      className={PAYMENT_PROCESSING_OVERLAY_STYLES.backdrop}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={PAYMENT_PROCESSING_OVERLAY_STYLES.card}>
        <Loader2
          size={32}
          className={PAYMENT_PROCESSING_OVERLAY_STYLES.spinner}
          aria-hidden
        />
        <p className={PAYMENT_PROCESSING_OVERLAY_STYLES.title}>{title}</p>
        {description ? (
          <p className={PAYMENT_PROCESSING_OVERLAY_STYLES.description}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
