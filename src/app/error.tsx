"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorState } from "@/shared/components/system/ErrorState.component";

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
    <ErrorState
      size="screen"
      headingLevel="h1"
      heading={LABELS.unexpectedErrorHeading}
      message={LABELS.unexpectedErrorBody}
      onRetry={reset}
      reference={error.digest}
    />
  );
}
