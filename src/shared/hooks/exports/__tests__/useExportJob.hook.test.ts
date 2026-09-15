import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { useExportJob } from "../useExportJob.hook";

vi.mock("@/shared/api/exports/exportJobs.api", () => ({
  exportJobsApi: {
    start: vi.fn(),
  },
}));

describe("useExportJob", () => {
  beforeEach(() => {
    useExportJobsStore.setState({ jobs: [] });
    vi.mocked(exportJobsApi.start).mockReset();
  });

  it("tracks the new job and reflects store state", async () => {
    vi.mocked(exportJobsApi.start).mockResolvedValue({
      jobId: "job-1",
      status: "QUEUED",
    });
    const { result } = renderHook(() => useExportJob("report", "gmv-sales"));
    await act(async () => {
      await result.current.start("gmv-sales", "csv", { from: "2025-01-01" });
    });
    expect(result.current.jobId).toBe("job-1");
    expect(useExportJobsStore.getState().jobs[0]?.jobId).toBe("job-1");
    act(() => {
      useExportJobsStore
        .getState()
        .updateJob("job-1", { status: "PROCESSING", progressPercent: 30 });
    });
    expect(result.current.status).toBe("PROCESSING");
    expect(result.current.progressPercent).toBe(30);
  });

  it("sets errorMessage on a rejected start and does not create a store entry", async () => {
    vi.mocked(exportJobsApi.start).mockRejectedValue(
      new Error("Too many exports requested — please wait a moment"),
    );
    const { result } = renderHook(() => useExportJob("report", "gmv-sales"));
    await act(async () => {
      const id = await result.current.start("gmv-sales", "csv", {});
      expect(id).toBeNull();
    });
    expect(result.current.errorMessage).toBe(
      "Too many exports requested — please wait a moment",
    );
    expect(result.current.jobId).toBeNull();
    expect(useExportJobsStore.getState().jobs).toEqual([]);
  });

  it("ignores a second synchronous start before the first POST resolves", async () => {
    let resolveStart: (value: { jobId: string; status: string }) => void = () =>
      undefined;
    vi.mocked(exportJobsApi.start).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStart = resolve;
        }),
    );
    const { result } = renderHook(() => useExportJob("report", "gmv-sales"));
    act(() => {
      void result.current.start("gmv-sales", "csv", {});
      void result.current.start("gmv-sales", "xlsx", {});
    });
    expect(exportJobsApi.start).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveStart({ jobId: "job-1", status: "QUEUED" });
    });
    await waitFor(() => expect(result.current.jobId).toBe("job-1"));
  });
});
