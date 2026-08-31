"use client";

import { Loader2 } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 px-4 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm border border-line bg-surface-raised px-6 py-8 text-center shadow-elevation-2">
        <Loader2
          size={32}
          className="mx-auto animate-spin text-brand"
          aria-hidden
        />
        <p className="mt-4 font-medium text-ink">{title}</p>
        {description ? (
          <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
