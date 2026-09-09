"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/components/errorBoundary.styles";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Admin workspace route error boundary (Rule 13/20). */
export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: "admin", digest: error.digest });
  }, [error]);

  return (
    <div className={styles.workspaceShell}>
      <header className={styles.workspaceHeader} />
      <div className={styles.workspaceBody}>
        <aside className={styles.workspaceSidebar} />
        <main className={styles.workspaceMain}>
          <h2 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h2>
          <ErrorFallbackActions onReset={reset} />
        </main>
      </div>
    </div>
  );
}
