import { describe, expect, it } from "vitest";
import { LABELS, formatExportProcessing } from "@/shared/constants/labels";
import type { TrackedExportJob } from "@/shared/stores/exports/exportJobs.store";
import {
  resolveExportJobStatusMessage,
  resolveExportJobErrorText,
} from "../exportJobStatusMessage";

function job(overrides: Partial<TrackedExportJob> = {}): TrackedExportJob {
  return {
    jobId: "job-1",
    label: "gmv-sales",
    status: "QUEUED",
    progressPercent: 0,
    filename: null,
    errorMessage: null,
    ...overrides,
  };
}

describe("resolveExportJobStatusMessage", () => {
  it("maps QUEUED to exportQueued", () => {
    expect(resolveExportJobStatusMessage(job({ status: "QUEUED" }))).toBe(
      LABELS.exportQueued,
    );
  });

  it("maps PROCESSING at 0% to exportProcessingUnknown, not a 0% string", () => {
    expect(
      resolveExportJobStatusMessage(
        job({ status: "PROCESSING", progressPercent: 0 }),
      ),
    ).toBe(LABELS.exportProcessingUnknown);
    expect(
      resolveExportJobStatusMessage(
        job({ status: "PROCESSING", progressPercent: 0 }),
      ),
    ).not.toBe(formatExportProcessing(0));
  });

  it("maps PROCESSING with a real percent to the interpolated string", () => {
    expect(
      resolveExportJobStatusMessage(
        job({ status: "PROCESSING", progressPercent: 42 }),
      ),
    ).toBe(formatExportProcessing(42));
  });

  it("prefers the filename for COMPLETED, falling back to exportCompleted", () => {
    expect(
      resolveExportJobStatusMessage(
        job({ status: "COMPLETED", filename: "gmv-sales.csv" }),
      ),
    ).toBe("gmv-sales.csv");
    expect(
      resolveExportJobStatusMessage(
        job({ status: "COMPLETED", filename: null }),
      ),
    ).toBe(LABELS.exportCompleted);
  });

  it("maps CANCELLED and returns null for FAILED", () => {
    expect(resolveExportJobStatusMessage(job({ status: "CANCELLED" }))).toBe(
      LABELS.exportCancelled,
    );
    expect(resolveExportJobStatusMessage(job({ status: "FAILED" }))).toBeNull();
  });
});

describe("resolveExportJobErrorText", () => {
  it("returns errorMessage verbatim regardless of status", () => {
    expect(
      resolveExportJobErrorText(
        job({ status: "QUEUED", errorMessage: LABELS.exportCancelTooLate }),
      ),
    ).toBe(LABELS.exportCancelTooLate);
  });

  it("falls back to exportFailed for a FAILED job with no message", () => {
    expect(
      resolveExportJobErrorText(job({ status: "FAILED", errorMessage: null })),
    ).toBe(LABELS.exportFailed);
  });

  it("returns null for any other status with no message", () => {
    expect(
      resolveExportJobErrorText(
        job({ status: "PROCESSING", errorMessage: null }),
      ),
    ).toBeNull();
  });
});
