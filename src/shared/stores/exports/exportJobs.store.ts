import { create } from "zustand";
import type { ExportJobStatus } from "@/shared/types/exports.types";

export type TrackedExportJob = {
  jobId: string;
  label: string;
  status: ExportJobStatus;
  progressPercent: number;
  filename: string | null;
  errorMessage: string | null;
};

interface ExportJobsState {
  jobs: TrackedExportJob[];
  trackJob: (
    jobId: string,
    label: string,
    initial?: Partial<TrackedExportJob>,
  ) => void;
  updateJob: (jobId: string, patch: Partial<TrackedExportJob>) => void;
  dismissJob: (jobId: string) => void;
}

/**
 * Global export-in-progress registry (Rule: one source of truth). A page's
 * `useExportJob` hook calls `trackJob` when it kicks off a job; the
 * always-mounted `ExportJobsTrayContainer` (app-providers.tsx) renders every
 * tracked job's live status regardless of which route the user navigates to
 * next — exports outlive the page that started them.
 *
 * `initial` exists for one specific caller: `useRecoverExportJobs` (Step
 * 17), which uses it for *every* job it re-tracks after a reload, not only
 * finished ones — a still-`PROCESSING` job is seeded with its real current
 * `progressPercent` too, not just its status. Without `initial` at all,
 * `trackJob` would force every recovered job to start at `QUEUED`/0%
 * regardless of its actual state: a genuinely 62%-done export would
 * visibly flash back to 0% for a few seconds after every reload before
 * self-correcting, and a `COMPLETED` job would briefly enter
 * `useExportJobsWatcher`'s "active" set and trigger the auto-download path
 * meant for jobs finishing *while someone's watching*, not ones being
 * reported after the fact.
 *
 * `MAX_TRACKED_JOBS = 25` — sized off the backend's own list cap
 * (`listExportJobsForUser`, Step 07, returns at most 20), with headroom
 * for one or two freshly-started exports on top of a full recovery sweep.
 * This isn't just a nicety: `useRecoverExportJobs` can call `trackJob` for
 * every unacknowledged finished job in one pass (up to 20 of them), and a
 * cap set too tight (an earlier draft of this file used 10) would silently
 * drop some of a user's legitimately-still-actionable, unacknowledged
 * exports from the tray the moment recovery ran — not lost server-side
 * (`GET /api/exports` still has them), but invisible in the one UI surface
 * meant to surface them. 25 comfortably covers the realistic union of "a
 * full recovery sweep" and "actively starting something new."
 */
const MAX_TRACKED_JOBS = 25;

export const useExportJobsStore = create<ExportJobsState>((set) => ({
  jobs: [],
  trackJob: (jobId, label, initial) =>
    set((state) => {
      const tracked: TrackedExportJob = {
        jobId,
        label,
        status: initial?.status ?? "QUEUED",
        progressPercent: initial?.progressPercent ?? 0,
        filename: initial?.filename ?? null,
        errorMessage: initial?.errorMessage ?? null,
      };
      return {
        jobs: [tracked, ...state.jobs.filter((j) => j.jobId !== jobId)].slice(
          0,
          MAX_TRACKED_JOBS,
        ),
      };
    }),
  updateJob: (jobId, patch) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.jobId === jobId ? { ...j, ...patch } : j)),
    })),
  dismissJob: (jobId) =>
    set((state) => ({ jobs: state.jobs.filter((j) => j.jobId !== jobId) })),
}));
