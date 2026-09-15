"use client";

import { useEffect } from "react";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";

export function useRecoverExportJobs() {
  const trackJob = useExportJobsStore((s) => s.trackJob);

  useEffect(() => {
    let cancelled = false;
    void exportJobsApi
      .list()
      .then((jobs) => {
        if (cancelled) return;
        for (const job of jobs) {
          if (job.status === "QUEUED" || job.status === "PROCESSING") {
            // Still running — re-enter the normal live-progress path, seeded
            // with the *actual current* progress the list response already
            // carries (`ExportJobListItem.progressPercent`), not a blind
            // QUEUED/0% default. An earlier draft of this hook defaulted
            // here on the reasoning that "the watcher reconnects and the
            // real status arrives within one tick either way" — true, but
            // "within one tick" is still a visible few-second window (the
            // next natural progress broadcast, or the first poll interval,
            // whichever comes first) where a genuinely 80%-done export
            // would flash as freshly-queued at 0% for no reason, when the
            // correct number was sitting right here in the response that
            // was already fetched. There's no reason to show a wrong
            // number for even a moment when the right one costs nothing
            // extra to use.
            trackJob(job.id, job.exportType, {
              status: job.status,
              progressPercent: job.progressPercent,
              filename: job.filename,
              errorMessage: job.errorMessage,
            });
            continue;
          }
          if (
            (job.status === "COMPLETED" || job.status === "FAILED") &&
            !job.acknowledgedAt
          ) {
            // Finished while nobody was watching — seed it as its *actual*
            // terminal state, not QUEUED. This keeps it out of the
            // watcher's "active" set entirely, so it never opens a socket
            // room for a job that's already done and never runs through
            // the auto-download path meant for a job finishing live.
            trackJob(job.id, job.exportType, {
              status: job.status,
              progressPercent: job.status === "COMPLETED" ? 100 : 0,
              filename: job.filename,
              errorMessage: job.errorMessage,
            });
          }
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [trackJob]);
}
