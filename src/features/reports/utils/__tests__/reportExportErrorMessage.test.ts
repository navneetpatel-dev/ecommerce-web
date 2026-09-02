import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import { getReportExportErrorMessage } from "../reportExportErrorMessage";

describe("getReportExportErrorMessage", () => {
  it("maps RATE_LIMITED ApiError to export-specific label", () => {
    const err = new ApiError(
      ERROR_CODES.RATE_LIMITED,
      "Too many export requests",
    );
    expect(getReportExportErrorMessage(err, LABELS.reportLoadError)).toBe(
      LABELS.reportExportRateLimited,
    );
  });

  it("maps timeout errors to export timeout label", () => {
    const err = new Error("timed out");
    err.name = "TimeoutError";
    expect(getReportExportErrorMessage(err, LABELS.reportLoadError)).toBe(
      LABELS.reportExportTimeout,
    );
  });

  it("maps abort errors to export timeout label", () => {
    const err = new Error("aborted");
    err.name = "AbortError";
    expect(getReportExportErrorMessage(err, LABELS.reportLoadError)).toBe(
      LABELS.reportExportTimeout,
    );
  });

  it("falls back via getApiErrorMessage for other errors", () => {
    const err = new ApiError(ERROR_CODES.UPLOAD_FAILED, "raw");
    expect(getReportExportErrorMessage(err, LABELS.reportLoadError)).toBe(
      LABELS.uploadFailed,
    );
  });
});
