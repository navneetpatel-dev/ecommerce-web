"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/styles/system/errorBoundary.styles";

interface StorefrontErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Storefront route error boundary (Rule 13/20). */
export default function StorefrontError({
  error,
  reset,
}: StorefrontErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: "storefront", digest: error.digest });
  }, [error]);

  return (
    <div className={styles.screenCenterCol}>
      <h2 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h2>
      <ErrorFallbackActions onReset={reset} />
    </div>
  );
}
