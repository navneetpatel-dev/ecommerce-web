import { useAuthStore } from "@/shared/stores/auth.store";
import type { BugListParams } from "./bugReports.api";

/** Centralized cache keys for bug-report queries. */
export const bugReportKeys = {
  all: ["bugReports"] as const,
  mine: (filters: BugListParams = {}) =>
    [...bugReportKeys.all, "mine", filters] as const,
  admin: (filters: BugListParams = {}) =>
    [...bugReportKeys.all, "admin", filters] as const,
  detail: (id: string) => [...bugReportKeys.all, "detail", id] as const,
  comments: (id: string) => [...bugReportKeys.all, "comments", id] as const,
};

/** Bug endpoints are auth-gated across every consumer hook. */
export function useBugQueryEnabled() {
  return Boolean(useAuthStore((s) => s.accessToken));
}
