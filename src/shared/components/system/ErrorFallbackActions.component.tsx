"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { errorBoundaryStyles as styles } from "../../styles/system/errorBoundary.styles";

interface ErrorFallbackActionsProps {
  /** Re-render the failing segment (App Router `reset`) or re-run the failed query. */
  onReset: () => void;
}

/**
 * The recover/escape pair rendered by `ErrorState` (Rule 13: failed requests
 * surface a recoverable error with retry). Stacks full-width on phones.
 */
export function ErrorFallbackActions({ onReset }: ErrorFallbackActionsProps) {
  // Hard navigation: the client router may be part of what failed.
  const goHome = () => {
    window.location.assign(PATHS.home);
  };

  return (
    <div className={styles.actions}>
      <Button className={styles.actionButton} onClick={onReset}>
        {LABELS.retry}
      </Button>
      <Button
        variant="outline"
        className={styles.actionButton}
        onClick={goHome}
      >
        {LABELS.backToHome}
      </Button>
    </div>
  );
}
