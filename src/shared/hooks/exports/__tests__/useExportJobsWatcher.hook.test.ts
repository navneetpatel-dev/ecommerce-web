import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { useExportJobsWatcher } from "../useExportJobsWatcher.hook";

const listeners = new Map<string, (payload: unknown) => void>();
const socket = {
  on: vi.fn((event: string, cb: (payload: unknown) => void) => {
    listeners.set(event, cb);
  }),
  emit: vi.fn(),
  disconnect: vi.fn(),
};
const io = vi.fn((_url?: string, _opts?: Record<string, unknown>) => socket);

vi.mock("socket.io-client", () => ({
  io: (url: string, opts?: Record<string, unknown>) => io(url, opts),
}));

vi.mock("@/shared/api/exports/exportJobs.api", () => ({
  exportJobsApi: {
    status: vi.fn(),
    downloadUrl: vi.fn(),
  },
}));

vi.mock("@/shared/api/client/sessionAdapter", () => ({
  getApiSessionAdapter: () => ({ getAccessToken: () => "token" }),
}));

describe("useExportJobsWatcher", () => {
  let unmountHook: (() => void) | undefined;

  beforeEach(() => {
    useExportJobsStore.setState({ jobs: [] });
    listeners.clear();
    io.mockClear();
    socket.on.mockClear();
    socket.emit.mockClear();
    socket.disconnect.mockClear();
    vi.mocked(exportJobsApi.status).mockReset();
    vi.mocked(exportJobsApi.downloadUrl)
      .mockReset()
      .mockResolvedValue({ url: "https://files.test/a.csv" });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => undefined,
    );
  });

  afterEach(() => {
    unmountHook?.();
    unmountHook = undefined;
    vi.useRealTimers();
  });

  it("opens exactly one socket for multiple active jobs and disconnects when none remain", async () => {
    const { unmount } = renderHook(() => useExportJobsWatcher());
    unmountHook = unmount;
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("a", "one", { status: "PROCESSING" });
      useExportJobsStore.getState().trackJob("b", "two", { status: "QUEUED" });
    });
    await waitFor(() => expect(io).toHaveBeenCalledTimes(1));
    act(() => {
      useExportJobsStore.getState().updateJob("a", { status: "COMPLETED" });
      useExportJobsStore.getState().updateJob("b", { status: "COMPLETED" });
    });
    await waitFor(() => expect(socket.disconnect).toHaveBeenCalled());
  });

  it("does not poll a job whose socket events are fresh", async () => {
    const { unmount } = renderHook(() => useExportJobsWatcher());
    unmountHook = unmount;
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("a", "one", { status: "PROCESSING" });
    });
    await waitFor(() => expect(listeners.has("export:progress")).toBe(true));
    vi.useFakeTimers();
    act(() => {
      listeners.get("export:progress")?.({
        jobId: "a",
        rowsProcessed: 10,
        total: 100,
      });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4_000);
    });
    expect(exportJobsApi.status).not.toHaveBeenCalled();
  });

  it("downloads exactly once when both socket and poll observe COMPLETED", async () => {
    const { unmount } = renderHook(() => useExportJobsWatcher());
    unmountHook = unmount;
    act(() => {
      useExportJobsStore
        .getState()
        .trackJob("a", "one", { status: "PROCESSING" });
    });
    await waitFor(() => expect(listeners.has("export:completed")).toBe(true));
    await act(async () => {
      listeners.get("export:completed")?.({ jobId: "a" });
      await Promise.resolve();
    });
    vi.mocked(exportJobsApi.status).mockResolvedValue({
      jobId: "a",
      status: "COMPLETED",
      progressPercent: 100,
      rowsProcessed: 10,
      totalRowsEstimate: 10,
      filename: "a.csv",
      errorMessage: null,
    });
    await act(async () => {
      listeners.get("export:completed")?.({ jobId: "a" });
      await Promise.resolve();
    });
    expect(exportJobsApi.downloadUrl).toHaveBeenCalledTimes(1);
  });

  it("clears a stale client-side errorMessage on export:progress", async () => {
    const { unmount } = renderHook(() => useExportJobsWatcher());
    unmountHook = unmount;
    act(() => {
      useExportJobsStore.getState().trackJob("a", "one", {
        status: "QUEUED",
        errorMessage: "Too late to cancel — this export already started",
      });
    });
    await waitFor(() => expect(listeners.has("export:progress")).toBe(true));
    act(() => {
      listeners.get("export:progress")?.({
        jobId: "a",
        rowsProcessed: 5,
        total: 100,
      });
    });
    expect(useExportJobsStore.getState().jobs[0]?.errorMessage).toBeNull();
    expect(useExportJobsStore.getState().jobs[0]?.status).toBe("PROCESSING");
  });
});
