"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions.component";
import { errorBoundaryStyles as styles } from "@/shared/components/errorBoundary.styles";

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
    <div className="min-h-screen bg-paper">
      <header className="h-14 border-b border-line" />
      <div className="flex">
        <aside className="w-56 shrink-0 border-r border-line min-h-[calc(100vh-3.5rem)]" />
        <main className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <h2 className={styles.heading}>{LABELS.unexpectedErrorHeading}</h2>
          <ErrorFallbackActions onReset={reset} />
        </main>
      </div>
    </div>
  );
}
