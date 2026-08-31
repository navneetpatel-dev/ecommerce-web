import { LABELS } from "@/shared/constants/labels";
import type { ExportPollOutcome } from "../hooks/useReportHubHelpers/index";

export class ReportExportPollError extends Error {
  readonly outcome: "failed" | "timeout";

  constructor(outcome: "failed" | "timeout", message?: string) {
    super(
      message ??
        (outcome === "failed"
          ? LABELS.reportAsyncFailed
          : LABELS.reportAsyncTimeout),
    );
    this.name = "ReportExportPollError";
    this.outcome = outcome;
  }
}

export type PollExportResult = {
  outcome: ExportPollOutcome;
  errorMessage?: string | null;
};

/** @deprecated Use followAsyncExport + applyPollOutcome instead. Throws on failed/timeout. */
export function assertPollOutcome(result: PollExportResult): void {
  if (result.outcome === "ready" || result.outcome === "aborted") return;
  if (result.outcome === "failed") {
    throw new ReportExportPollError("failed", result.errorMessage ?? undefined);
  }
  if (result.outcome === "timeout") {
    throw new ReportExportPollError("timeout");
  }
}
