"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { errorBoundaryStyles as styles } from "./errorBoundary.styles";

interface ErrorFallbackActionsProps {
  /** Re-render the failing segment (App Router `reset`). */
  onReset: () => void;
}

/**
 * Shared recoverable error fallback used by route error boundaries
 * (Rule 13: failed requests surface a recoverable error with retry).
 */
export function ErrorFallbackActions({ onReset }: ErrorFallbackActionsProps) {
  const goHome = () => {
    window.location.assign(PATHS.home);
  };

  return (
    <>
      <p className={styles.body}>{LABELS.unexpectedErrorBody}</p>
      <div className={styles.actions}>
        <Button onClick={onReset}>{LABELS.retry}</Button>
        <Button variant="outline" onClick={goHome}>
          {LABELS.backToHome}
        </Button>
      </div>
    </>
  );
}
