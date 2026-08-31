import {
  isReportExportLocked,
  useReportExportLockStore,
} from "../stores/reportExportLock.store";

/** Runs an async export while holding the global in-flight lock. */
export async function withReportExportLock<T>(fn: () => Promise<T>): Promise<T | undefined> {
  if (isReportExportLocked()) return undefined;
  const { acquire, release } = useReportExportLockStore.getState();
  acquire();
  try {
    return await fn();
  } finally {
    release();
  }
}
