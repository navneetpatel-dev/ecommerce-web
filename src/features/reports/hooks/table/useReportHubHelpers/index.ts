import { LABELS } from "@/shared/constants/labels";
import { istDateString } from "@/shared/utils/formatting/istDate";

export type ExportFileFormat = "csv" | "pdf" | "xlsx";

export function defaultRange() {
  const now = new Date();
  return { from: istDateString(now, 30), to: istDateString(now) };
}

export function labelForKey(key: string): string {
  const map = LABELS as Record<string, string>;
  return map[key] ?? key;
}

export function normalizeExportFormat(value: unknown): ExportFileFormat {
  if (value === "csv" || value === "pdf" || value === "xlsx") return value;
  return "xlsx";
}

export function parseFormatFromExportPath(path: string): ExportFileFormat {
  try {
    const url = new URL(path, "http://local");
    return normalizeExportFormat(url.searchParams.get("format"));
  } catch {
    const match = path.match(/[?&]format=(csv|pdf|xlsx)/i);
    return normalizeExportFormat(match?.[1]?.toLowerCase());
  }
}
