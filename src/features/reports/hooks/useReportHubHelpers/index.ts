import { LABELS } from "@/shared/constants/labels";
import { REPORT_DOWNLOAD_TOAST_MS } from "@/shared/constants/timing";
import { reportsEngineApi } from "../../api/reportsEngine.api";

export function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function labelForKey(key: string): string {
  const map = LABELS as Record<string, string>;
  return map[key] ?? key;
}

export async function pollExportUntilReady(exportId: string) {
  const maxAttempts = 40;
  for (let i = 0; i < maxAttempts; i += 1) {
    const status = await reportsEngineApi.exportStatus(exportId);
    if (status.status === "READY" || status.status === "SYNC") {
      await reportsEngineApi.downloadExport(exportId);
      return "ready" as const;
    }
    if (status.status === "FAILED") {
      return "failed" as const;
    }
    await new Promise((r) => setTimeout(r, REPORT_DOWNLOAD_TOAST_MS));
  }
  return "pending" as const;
}
