import { create } from "zustand";

type ReportExportLockState = {
  inFlight: number;
  release: () => void;
};

function syncRemoteLock(delta: number) {
  if (typeof BroadcastChannel === "undefined") return;
  try {
    const channel = new BroadcastChannel("report-export-lock");
    channel.postMessage({ type: delta > 0 ? "acquire" : "release" });
    channel.close();
  } catch {
    /* optional */
  }
}

/** Global lock — disable all export buttons while any export is in flight. */
export const useReportExportLockStore = create<ReportExportLockState>((set) => ({
  inFlight: 0,
  release: () =>
    set((s) => {
      if (s.inFlight <= 0) return s;
      syncRemoteLock(-1);
      return { inFlight: Math.max(0, s.inFlight - 1) };
    }),
}));

if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
  const channel = new BroadcastChannel("report-export-lock");
  channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
    if (event.data?.type === "acquire") {
      useReportExportLockStore.setState((s) => ({ inFlight: s.inFlight + 1 }));
    }
    if (event.data?.type === "release") {
      useReportExportLockStore.setState((s) => ({
        inFlight: Math.max(0, s.inFlight - 1),
      }));
    }
  };
}

export function isReportExportLocked(): boolean {
  return useReportExportLockStore.getState().inFlight > 0;
}
