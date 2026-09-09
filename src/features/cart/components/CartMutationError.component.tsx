"use client";

import { AlertCircle, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cartMutationErrorStyles as styles } from "./cartMutationError.styles";

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

  return (
    <div role="alert" className={styles.root(className)}>
      <AlertCircle className={styles.icon} aria-hidden />
      <p className={styles.message}>{message}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={styles.dismissButton}
        aria-label={LABELS.dismiss}
        onClick={onDismiss}
      >
        <X className={styles.dismissIcon} aria-hidden />
      </Button>
    </div>
  );
}
