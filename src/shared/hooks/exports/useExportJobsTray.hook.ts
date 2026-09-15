"use client";

import { useCallback } from "react";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { LABELS } from "@/shared/constants/labels";

export function useExportJobsTray() {
  const jobs = useExportJobsStore((s) => s.jobs);
  const dismissJob = useExportJobsStore((s) => s.dismissJob);
  const updateJob = useExportJobsStore((s) => s.updateJob);
  const activeJobs = jobs.filter(
    (j) => j.status === "QUEUED" || j.status === "PROCESSING",
  );
  const recentJobs = jobs.filter(
    (j) => j.status !== "QUEUED" && j.status !== "PROCESSING",
  );

  const handleDismiss = useCallback(
    (jobId: string) => {
      const job = jobs.find((j) => j.jobId === jobId);
      if (job && (job.status === "COMPLETED" || job.status === "FAILED")) {
        void exportJobsApi.acknowledge(jobId).catch(() => undefined);
      }
      dismissJob(jobId);
    },
    [jobs, dismissJob],
  );

  const handleDownload = useCallback(
    (jobId: string) => {
      void exportJobsApi
        .downloadUrl(jobId)
        .then(({ url }) => {
          const a = document.createElement("a");
          a.href = url;
          a.click();
          // Acknowledge only after the download actually fired — chained
          // deliberately, not fired in parallel. If `downloadUrl` rejects (a
          // network blip, an expired session), the job must stay
          // unacknowledged so it resurfaces on the next reload instead of
          // silently disappearing without ever having been downloaded. A
          // failure to acknowledge itself (rare — the download already
          // succeeded by this point) still fails open for the same reason
          // `handleDismiss` does: worst case, the job asks to be seen again.
          void exportJobsApi.acknowledge(jobId).catch(() => undefined);
        })
        .catch(() => {
          // This is the manual Download button's own failure path — a
          // separate bug from the one Step 17's handleCompleted already
          // guards against (the *automatic* download that fires the
          // instant a live job completes). An earlier draft of this
          // function had `.catch(() => undefined)` here: a user explicitly
          // clicking Download, having it fail, and getting *zero*
          // feedback — no error, no retry indication, the button just
          // silently does nothing. Same fix, same label, applied to the
          // path that was actually missing it.
          updateJob(jobId, { errorMessage: LABELS.exportDownloadLinkFailed });
        });
    },
    [updateJob],
  );

  const handleCancel = useCallback(
    (jobId: string) => {
      void exportJobsApi
        .cancel(jobId)
        .then(() => {
          // updateJob, not dismissJob — a cancelled row stays visible with
          // "Export cancelled" (LABELS.exportCancelled, via
          // resolveExportJobStatusMessage) until the user dismisses it
          // themselves, same as COMPLETED/FAILED already do. An earlier
          // draft called dismissJob here directly, which made the card
          // silently vanish the instant Cancel was clicked — no
          // confirmation that the click even did anything.
          updateJob(jobId, { status: "CANCELLED" });
        })
        .catch(() => {
          // The most likely rejection here is a race that's actually good
          // news: the backend already moved the job past QUEUED (a worker
          // picked it up right as the user clicked Cancel) and rejects the
          // cancel as a result — see Step 07's `cancelQueuedExportJob`. The
          // row is still live and about to start reporting real progress,
          // so leaving it in place and telling the user why is more
          // correct than silently removing a job that's actually running.
          updateJob(jobId, { errorMessage: LABELS.exportCancelTooLate });
        });
    },
    [updateJob],
  );

  return {
    activeJobs,
    recentJobs,
    handleDismiss,
    handleDownload,
    handleCancel,
  };
}
