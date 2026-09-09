import { isPaginatedList, type PaginatedList } from "@/shared/api/pagination";
import { shouldInferAdminColumn } from "./adminTableCells";
import type { AdminDataRow } from "../hooks/useAdminDataList.hook";

export function normalizeResult(
  data: unknown,
): PaginatedList<AdminDataRow> | AdminDataRow[] {
  if (Array.isArray(data)) return data as AdminDataRow[];
  if (isPaginatedList<AdminDataRow>(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    const value = data as {
      items: AdminDataRow[];
      total?: number;
      totalPages?: number;
      page?: number;
      limit?: number;
    };
    return {
      items: value.items,
      total: value.total ?? value.items.length,
      page: value.page ?? 1,
      limit: value.limit ?? (value.items.length || 1),
      totalPages: value.totalPages ?? 1,
    };
  }
  return [];
}

/** Infer readable columns from the first row (skips IDs and bulky nested payloads). */
export function inferAdminColumns(rows: AdminDataRow[], max = 5): string[] {
  if (!rows[0]) return [];
  return Object.keys(rows[0])
    .filter((key) => shouldInferAdminColumn(key))
    .slice(0, max);
}
