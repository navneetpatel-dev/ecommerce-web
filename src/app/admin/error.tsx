"use client";

import { useEffect } from "react";
import { LABELS } from "@/shared/constants/labels";
import { reportError } from "@/shared/lib/errorReporting";
import { ErrorFallbackActions } from "@/shared/components/ErrorFallbackActions";
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
