import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { LABELS } from "@/shared/constants/labels";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { useExportJobsTray } from "../useExportJobsTray.hook";

vi.mock("@/shared/api/exports/exportJobs.api", () => ({
  exportJobsApi: {
    acknowledge: vi.fn(),
    downloadUrl: vi.fn(),
    cancel: vi.fn(),
  },
}));

describe("useExportJobsTray", () => {
  beforeEach(() => {
    useExportJobsStore.setState({ jobs: [] });
    vi.mocked(exportJobsApi.acknowledge)
      .mockReset()
      .mockResolvedValue({ acknowledged: true });
    vi.mocked(exportJobsApi.downloadUrl).mockReset();
    vi.mocked(exportJobsApi.cancel).mockReset();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => undefined,
    );
  });

  it("acknowledges COMPLETED/FAILED on dismiss but not QUEUED/PROCESSING", () => {
    const { result } = renderHook(() => useExportJobsTray());
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("done", "a", { status: "COMPLETED" });
      useExportJobsStore
        .getState()
        .trackJob("run", "b", { status: "PROCESSING" });
    });
    act(() => result.current.handleDismiss("done"));
    act(() => result.current.handleDismiss("run"));
    expect(exportJobsApi.acknowledge).toHaveBeenCalledTimes(1);
    expect(exportJobsApi.acknowledge).toHaveBeenCalledWith("done");
  });

  it("acknowledges after a successful download, not when downloadUrl rejects", async () => {
    vi.mocked(exportJobsApi.downloadUrl).mockResolvedValue({
      url: "https://files.test/a.csv",
    });
    const { result } = renderHook(() => useExportJobsTray());
    await act(async () => {
      result.current.handleDownload("job-1");
      await Promise.resolve();
    });
    expect(exportJobsApi.acknowledge).toHaveBeenCalledWith("job-1");

    vi.mocked(exportJobsApi.acknowledge).mockClear();
    vi.mocked(exportJobsApi.downloadUrl).mockRejectedValue(new Error("nope"));
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("job-2", "b", { status: "COMPLETED" });
    });
    await act(async () => {
      result.current.handleDownload("job-2");
      await Promise.resolve();
    });
    expect(exportJobsApi.acknowledge).not.toHaveBeenCalled();
    expect(
      useExportJobsStore.getState().jobs.find((j) => j.jobId === "job-2")
        ?.errorMessage,
    ).toBe(LABELS.exportDownloadLinkFailed);
  });

  it("marks a cancelled job CANCELLED instead of removing it", async () => {
    vi.mocked(exportJobsApi.cancel).mockResolvedValue({ cancelled: true });
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("job-1", "a", { status: "QUEUED" });
    });
    const { result } = renderHook(() => useExportJobsTray());
    await act(async () => {
      result.current.handleCancel("job-1");
      await Promise.resolve();
    });
    expect(
      useExportJobsStore.getState().jobs.find((j) => j.jobId === "job-1")
        ?.status,
    ).toBe("CANCELLED");
  });

  it("annotates a lost cancel race without changing status", async () => {
    vi.mocked(exportJobsApi.cancel).mockRejectedValue(
      new Error("not cancellable"),
    );
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("job-1", "a", { status: "QUEUED" });
    });
    const { result } = renderHook(() => useExportJobsTray());
    await act(async () => {
      result.current.handleCancel("job-1");
      await Promise.resolve();
    });
    const tracked = useExportJobsStore
      .getState()
      .jobs.find((j) => j.jobId === "job-1");
    expect(tracked?.status).toBe("QUEUED");
    expect(tracked?.errorMessage).toBe(LABELS.exportCancelTooLate);
  });
});
