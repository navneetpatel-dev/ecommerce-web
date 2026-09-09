import { apiClient } from "./client";

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

/** Unwrap cursor-paginated list envelopes (`data[]` + `meta.nextCursor`). */
export async function fetchCursorPage<T>(path: string): Promise<CursorPage<T>> {
  const res = await apiClient.getWithResponse<T[]>(path);
  const nextCursor =
    typeof res.meta?.nextCursor === "string" ? res.meta.nextCursor : null;
  return { items: res.data ?? [], nextCursor };
}
