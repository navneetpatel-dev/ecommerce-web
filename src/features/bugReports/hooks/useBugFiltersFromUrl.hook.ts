import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  BUG_AFFECTED_MODULE_VALUES,
  BUG_REPORT_SEVERITY_VALUES,
  BUG_REPORT_STATUS_VALUES,
  BUG_REPORTER_ROLE_VALUES,
  type BugAffectedModule,
  type BugReporterRole,
  type BugReportSeverity,
  type BugReportStatus,
} from "@/shared/constants/statuses";
import type { BugListParams } from "../api/bugReports.api";

export function useBugFiltersFromUrl(): BugListParams {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const status = searchParams.get("status") as BugReportStatus | null;
    const severity = searchParams.get("severity") as BugReportSeverity | null;
    const affectedModule = searchParams.get(
      "affectedModule",
    ) as BugAffectedModule | null;
    const reporterRole = searchParams.get(
      "reporterRole",
    ) as BugReporterRole | null;
    return {
      status:
        status && BUG_REPORT_STATUS_VALUES.includes(status)
          ? status
          : undefined,
      severity:
        severity && BUG_REPORT_SEVERITY_VALUES.includes(severity)
          ? severity
          : undefined,
      affectedModule:
        affectedModule && BUG_AFFECTED_MODULE_VALUES.includes(affectedModule)
          ? affectedModule
          : undefined,
      reporterRole:
        reporterRole && BUG_REPORTER_ROLE_VALUES.includes(reporterRole)
          ? reporterRole
          : undefined,
    };
  }, [searchParams]);
}
