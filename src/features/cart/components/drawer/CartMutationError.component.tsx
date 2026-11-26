"use client";

import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { AlertCircle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cartMutationErrorStyles as styles } from "../../styles/drawer/cartMutationError.styles";

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
      <IconCloseButton
        variant="inline"
        label={LABELS.dismiss}
        onClick={onDismiss}
      />
    </div>
  );
}
