"use client";

import { useCallback, useRef, useState } from "react";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { LABELS } from "@/shared/constants/labels";
import type { ExportFileFormat } from "@/shared/types/exports.types";

export function useExportJob(domain: string, label: string) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const trackJob = useExportJobsStore((s) => s.trackJob);
  const job = useExportJobsStore(
    (s) => s.jobs.find((j) => j.jobId === jobId) ?? null,
  );

  const start = useCallback(
    async (
      exportType: string,
      format: ExportFileFormat,
      filters: Record<string, unknown>,
    ) => {
      if (submittingRef.current) return null; // a second click before the first POST resolves is a no-op, not a second job
      submittingRef.current = true;
      setSubmitting(true);
      setCreateError(null);
      try {
        const { jobId: newJobId } = await exportJobsApi.start({
          domain,
          exportType,
          format,
          filters,
        });
        setJobId(newJobId);
        trackJob(newJobId, label);
        return newJobId;
      } catch (err) {
        setCreateError(
          err instanceof Error ? err.message : LABELS.exportStartFailed,
        );
        return null;
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [domain, label, trackJob],
  );

  const reset = useCallback(() => {
    setJobId(null);
    setCreateError(null);
  }, []);

  return {
    jobId,
    status: job?.status ?? null,
    progressPercent: job?.progressPercent ?? 0,
    filename: job?.filename ?? null,
    // A creation-time failure (never got a jobId) takes priority over a
    // stale errorMessage from a *previous* job this hook instance tracked —
    // there's no store entry for this attempt at all, so the store has
    // nothing more recent to say.
    errorMessage: createError ?? job?.errorMessage ?? null,
    inProgress:
      submitting ||
      (job ? job.status === "QUEUED" || job.status === "PROCESSING" : false),
    start,
    reset,
  };
}
