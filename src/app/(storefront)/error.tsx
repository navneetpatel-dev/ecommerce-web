"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorState } from "@/shared/components/system/ErrorState.component";

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
    <ErrorState
      headingLevel="h1"
      heading={LABELS.unexpectedErrorHeading}
      message={LABELS.unexpectedErrorBody}
      onRetry={reset}
      reference={error.digest}
    />
  );
}
