"use client";

import { useEffect } from "react";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";

export function useRecoverExportJobs() {
  const trackJob = useExportJobsStore((s) => s.trackJob);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    // Same reasoning as `useCart`'s `enabled: authBootstrapped`: the access
    // token is memory-only, so on a hard refresh this request used to leave
    // before the bootstrap's silent `POST /api/auth/refresh` resolved. Without
    // an Authorization header it was a guaranteed 401, and the client's
    // 401-recovery path then spent a refresh round-trip before the retry
    // succeeded — the browser network tab showed four rows for two logical
    // calls. Anonymous visitors were worse off: they own no export jobs at
    // all, yet the same 401 pushed `sessionRefresh` into a failing refresh
    // plus `clearPersistedSession()` on every single page load.
    //
    // `authBootstrapped` (not `isAuthenticated`) is the load-bearing half: the
    // bootstrap hydrates `currentUser` from localStorage *before* the refresh
    // resolves, so an auth check on `accessToken || currentUser` already reads
    // true inside the race window. The flag only flips in the bootstrap's
    // `finally`, by which point the token is either present or definitively
    // absent-and-cleared.
    if (!authBootstrapped || !accessToken) return;
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
    // `accessToken` is a dep on purpose: a mid-session rotation (401-recovery,
    // sign-in) re-runs the recovery once. `trackJob` de-dupes by `jobId` and
    // seeds from the server's *current* state, so a re-run re-syncs instead of
    // duplicating — and it's what makes recovery work after signing in on a
    // page that was first loaded as a guest.
  }, [authBootstrapped, accessToken, trackJob]);
}
