import { create } from "zustand";

type ReportExportLockState = {
  inFlight: number;
  acquire: () => void;
  release: () => void;
};

/** Global lock — disable all export buttons while any export is in flight. */
export const useReportExportLockStore = create<ReportExportLockState>((set) => ({
  inFlight: 0,
  acquire: () => set((s) => ({ inFlight: s.inFlight + 1 })),
  release: () => set((s) => ({ inFlight: Math.max(0, s.inFlight - 1) })),
}));

export function isReportExportLocked(): boolean {
  return useReportExportLockStore.getState().inFlight > 0;
}
