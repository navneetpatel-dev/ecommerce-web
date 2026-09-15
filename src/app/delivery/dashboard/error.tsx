"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/styles/system/errorBoundary.styles";

interface DeliveryDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Delivery-workspace route error boundary (Rule 13/20) — mirrors admin/vendor dashboard error
 * boundaries. Without this, an uncaught render error on any delivery-agent screen (Today,
 * Deliveries, Pickups, History, a task detail page) unmounts the whole workspace shell and falls
 * back to the generic root error page, which has no link back into the agent's task queue.
 */
export default function DeliveryDashboardError({
  error,
  reset,
}: DeliveryDashboardErrorProps) {
  useEffect(() => {
    reportError(error, {
      boundary: "delivery-dashboard",
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className={styles.workspaceShell}>
      <header className={styles.workspaceHeader} />
      <main className={styles.workspaceMain}>
        <h2 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h2>
        <ErrorFallbackActions onReset={reset} />
      </main>
    </div>
  );
}
