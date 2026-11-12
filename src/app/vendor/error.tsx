"use client";

import { useEffect } from "react";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { errorBoundaryStyles as styles } from "@/shared/styles/system/errorBoundary.styles";

interface VendorErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Vendor route-segment error boundary covering /vendor and /vendor/register (Rule 13/20). */
export default function VendorError({ error, reset }: VendorErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: "vendor", digest: error.digest });
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
          <ErrorState
            headingLevel="h1"
            heading={LABELS.unexpectedErrorHeading}
            message={LABELS.unexpectedErrorBody}
            onRetry={reset}
            reference={error.digest}
          />
        </main>
      </div>
    </div>
  );
}
