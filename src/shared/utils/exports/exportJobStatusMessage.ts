import { LABELS, formatExportProcessing } from "@/shared/constants/labels";
import type { TrackedExportJob } from "@/shared/stores/exports/exportJobs.store";

/**
 * The tray row's primary status line — `null` for `FAILED`, deliberately:
 * that state is carried by the row's separate, visually distinct error
 * text (see ExportJobRow below) instead of duplicating the same message in
 * two places with two different visual treatments.
 */
export function resolveExportJobStatusMessage(
  job: TrackedExportJob,
): string | null {
  switch (job.status) {
    case "QUEUED":
      return LABELS.exportQueued;
    case "PROCESSING":
      // progressPercent === 0 covers both "genuinely unknown total" and
      // "just started" — either way, showing a bare "0%" next to an
      // indeterminate-animated bar reads as broken/stuck, not as honest
      // uncertainty. "Exporting…" with no number reads correctly in both
      // cases and corrects itself the moment real numbers arrive.
      return job.progressPercent > 0
        ? formatExportProcessing(job.progressPercent)
        : LABELS.exportProcessingUnknown;
    case "COMPLETED":
      // The filename is more useful here than a generic "Export ready" —
      // it's the one piece of information the user actually wants once
      // it's done. Falls back to the generic label only in the edge case
      // where a completed job somehow has no filename recorded.
      return job.filename ?? LABELS.exportCompleted;
    case "CANCELLED":
      return LABELS.exportCancelled;
    case "FAILED":
      return null;
    default:
      return null;
  }
}

/**
 * The row's error line — covers a genuine `FAILED` job (falling back to a
 * generic message if the backend somehow sent no specific one) *and* the
 * one case where `errorMessage` can be set on a job that ISN'T `FAILED`:
 * Step 20's `handleCancel`, when a cancel request loses a race against a
 * worker picking the job up, annotates the still-`QUEUED`-about-to-become-
 * `PROCESSING` job with a message rather than changing its status. Keying
 * this purely on "is there a message" rather than "is the status FAILED"
 * is what makes that annotation actually visible.
 */
export function resolveExportJobErrorText(
  job: TrackedExportJob,
): string | null {
  if (job.errorMessage) return job.errorMessage;
  if (job.status === "FAILED") return LABELS.exportFailed;
  return null;
}
