"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/components/errorBoundary.styles";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper p-8">
      <h2 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h2>
      <ErrorFallbackActions onReset={reset} />
    </div>
  );
}
