"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/components/errorBoundary.styles";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root route error boundary — covers segments outside the storefront/admin/
 * vendor groups (auth screens, vendor register). Reports the error to the
 * crash SDK before rendering the recoverable fallback (Rule 20).
 */
export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: "root", digest: error.digest });
  }, [error]);

  return (
    <div className={styles.screenCenter}>
      <div className={styles.root}>
        <h2 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h2>
        <ErrorFallbackActions onReset={reset} />
      </div>
    </div>
  );
}
