import { LABELS } from "@/shared/constants/labels";
import { getReportExportErrorMessage } from "./reportExportErrorMessage";
import { withReportExportLock } from "./withReportExportLock";

export class ReportExportLockedError extends Error {
  constructor() {
    super(LABELS.reportExportLocked);
    this.name = "ReportExportLockedError";
  }
}

type RunReportExportHandlers = {
  onMessage?: (message: string | null) => void;
  onError?: (error: string | null) => void;
};

/** Global export lock + consistent export error mapping. */
export async function runReportExport(
  fn: () => Promise<void>,
  handlers?: RunReportExportHandlers,
): Promise<void> {
  const locked = await withReportExportLock(async () => {
    try {
      await fn();
    } catch (err) {
      handlers?.onError?.(getReportExportErrorMessage(err));
      throw err;
    }
  });
  if (locked === undefined) {
    handlers?.onError?.(LABELS.reportExportLocked);
    throw new ReportExportLockedError();
  }
}
