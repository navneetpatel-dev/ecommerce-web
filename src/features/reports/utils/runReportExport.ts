import { LABELS } from "@/shared/constants/labels";
import { getReportExportErrorMessage } from "./reportExportErrorMessage";
import { isBenignExportError } from "./asyncExportFlow";
import { ReportExportPollError } from "./reportExportPollError";
import { useReportExportLockStore } from "../stores/reportExportLock.store";

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

type RunReportExportOptions = {
  /** Resume deep links should not compete with user-initiated exports. */
  skipLock?: boolean;
};

function tryAcquireExportLock(): boolean {
  let acquired = false;
  useReportExportLockStore.setState((state) => {
    if (state.inFlight > 0) return state;
    acquired = true;
    return { inFlight: state.inFlight + 1 };
  });
  if (acquired && typeof BroadcastChannel !== "undefined") {
    try {
      const channel = new BroadcastChannel("report-export-lock");
      channel.postMessage({ type: "acquire" });
      channel.close();
    } catch {
      /* optional */
    }
  }
  return acquired;
}

/** Global export lock + consistent export error mapping. */
export async function runReportExport(
  fn: () => Promise<void>,
  handlers?: RunReportExportHandlers,
  options?: RunReportExportOptions,
): Promise<void> {
  if (!options?.skipLock && !tryAcquireExportLock()) {
    handlers?.onError?.(LABELS.reportExportLocked);
    throw new ReportExportLockedError();
  }
  const release = options?.skipLock
    ? () => undefined
    : useReportExportLockStore.getState().release;
  try {
    await fn();
  } catch (err) {
    if (err instanceof ReportExportPollError) {
      if (err.outcome === "timeout") {
        handlers?.onMessage?.(err.displayMessage);
        handlers?.onError?.(null);
      } else {
        handlers?.onError?.(err.displayMessage);
        handlers?.onMessage?.(null);
      }
      throw err;
    }
    if (isBenignExportError(err)) {
      handlers?.onError?.(null);
      handlers?.onMessage?.(null);
      throw err;
    }
    handlers?.onError?.(getReportExportErrorMessage(err));
    handlers?.onMessage?.(null);
    throw err;
  } finally {
    release();
  }
}

export { tryAcquireExportLock };
