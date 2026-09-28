"use client";

import { useEffect } from "react";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/system/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/styles/system/errorBoundary.styles";

interface VendorDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Vendor workspace route error boundary (Rule 13/20). */
export default function VendorDashboardError({
  error,
  reset,
}: VendorDashboardErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: "vendor-dashboard", digest: error.digest });
  }, [error]);

  return (
    <div className={styles.workspaceShell}>
      <header className={styles.workspaceHeader} />
      <div className={styles.workspaceBody}>
        <aside className={styles.workspaceSidebar} />
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className={styles.workspaceMain}
        >
          <h1 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h1>
          <ErrorFallbackActions onReset={reset} />
        </main>
      </div>
    </div>
  );
}
