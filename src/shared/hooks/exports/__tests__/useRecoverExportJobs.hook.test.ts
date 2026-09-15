import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { useRecoverExportJobs } from "../useRecoverExportJobs.hook";
import type { ExportJobListItem } from "@/shared/types/exports.types";

vi.mock("@/shared/api/exports/exportJobs.api", () => ({
  exportJobsApi: {
    list: vi.fn(),
  },
}));

function item(overrides: Partial<ExportJobListItem>): ExportJobListItem {
  return {
    id: "job-1",
    domain: "report",
    exportType: "gmv-sales",
    format: "csv",
    status: "QUEUED",
    progressPercent: 0,
    filename: null,
    errorMessage: null,
    acknowledgedAt: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("useRecoverExportJobs", () => {
  beforeEach(() => {
    useExportJobsStore.setState({ jobs: [] });
    vi.mocked(exportJobsApi.list).mockReset();
  });

  it("seeds a PROCESSING job with its real progressPercent, not QUEUED/0%", async () => {
    vi.mocked(exportJobsApi.list).mockResolvedValue([
      item({ id: "running", status: "PROCESSING", progressPercent: 62 }),
    ]);
    renderHook(() => useRecoverExportJobs());
    await waitFor(() => {
      const tracked = useExportJobsStore
        .getState()
        .jobs.find((j) => j.jobId === "running");
      expect(tracked?.status).toBe("PROCESSING");
      expect(tracked?.progressPercent).toBe(62);
    });
  });

  it("re-tracks unacknowledged finished jobs with their real terminal state", async () => {
    vi.mocked(exportJobsApi.list).mockResolvedValue([
      item({
        id: "done",
        status: "COMPLETED",
        progressPercent: 100,
        filename: "a.csv",
        acknowledgedAt: null,
      }),
      item({
        id: "fail",
        status: "FAILED",
        errorMessage: "nope",
        acknowledgedAt: null,
      }),
    ]);
    renderHook(() => useRecoverExportJobs());
    await waitFor(() =>
      expect(useExportJobsStore.getState().jobs).toHaveLength(2),
    );
    const done = useExportJobsStore
      .getState()
      .jobs.find((j) => j.jobId === "done");
    const fail = useExportJobsStore
      .getState()
      .jobs.find((j) => j.jobId === "fail");
    expect(done?.status).toBe("COMPLETED");
    expect(done?.progressPercent).toBe(100);
    expect(fail?.status).toBe("FAILED");
  });

  it("skips acknowledged finished jobs", async () => {
    vi.mocked(exportJobsApi.list).mockResolvedValue([
      item({
        id: "seen",
        status: "COMPLETED",
        acknowledgedAt: new Date().toISOString(),
      }),
    ]);
    renderHook(() => useRecoverExportJobs());
    await act(async () => {
      await Promise.resolve();
    });
    expect(useExportJobsStore.getState().jobs).toEqual([]);
  });
});
