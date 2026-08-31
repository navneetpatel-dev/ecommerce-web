import { LABELS } from "@/shared/constants/labels";
import type { ExportPollOutcome } from "../hooks/useReportHubHelpers/index";

export class ReportExportPollError extends Error {
  readonly outcome: "failed" | "timeout";

  constructor(outcome: "failed" | "timeout") {
    super(
      outcome === "failed"
        ? LABELS.reportAsyncFailed
        : LABELS.reportAsyncTimeout,
    );
    this.name = "ReportExportPollError";
    this.outcome = outcome;
  }
}

export function assertPollOutcome(outcome: ExportPollOutcome): void {
  if (outcome === "ready") return;
  if (outcome === "failed" || outcome === "timeout") {
    throw new ReportExportPollError(outcome);
  }
  throw new ReportExportPollError("timeout");
}
