import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { BugReport } from "../api/bugReports.api";

export function useBugReportListHandlers(detailHref: (id: string) => string) {
  const router = useRouter();

  const handleRowClick = useCallback(
    (row: BugReport) => {
      router.push(detailHref(row.id));
    },
    [detailHref, router],
  );

  const getRowId = useCallback((row: BugReport) => row.id, []);

  return {
    handleRowClick,
    getRowId,
  };
}
