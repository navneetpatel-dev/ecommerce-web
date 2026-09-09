"use client";

import { AlertCircle, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface CartMutationErrorProps {
  message: string | null;
  onDismiss: () => void;
  className?: string;
}

export function CartMutationError({
  message,
  onDismiss,
  className,
}: CartMutationErrorProps) {
  if (!message) return null;

  const rootClassName = `flex items-start gap-2 border border-danger/30 bg-danger-subtle px-3 py-2.5 text-body-sm text-danger ${className ?? ""}`;

  return (
    <div role="alert" className={rootClassName}>
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p className="min-w-0 flex-1 leading-relaxed">{message}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-7 min-h-7 max-h-7 w-7 shrink-0 p-0 text-danger hover:bg-danger/10 hover:text-danger"
        aria-label={LABELS.dismiss}
        onClick={onDismiss}
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </div>
  );
}
