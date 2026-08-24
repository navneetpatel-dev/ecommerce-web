import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { BugReport } from "../../api/bugReports.api";
import {
  BUG_MODULE_LABEL,
  BUG_SEVERITY_LABEL,
  BUG_STATUS_LABEL,
} from "../../utils/labels";
import { bugListHref } from "./bugReportDetailShared";

/** Back link, title, reporter meta and status/severity/module badges. */
export function BugReportHeader({
  report,
  mode,
  backHref,
}: {
  report: BugReport;
  mode: "reporter" | "admin";
  backHref?: string;
}) {
  const listHref = bugListHref(mode, backHref);

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link
          href={listHref}
          className="inline-flex items-center gap-1 text-body-sm text-ink-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {LABELS.bugBackToList}
        </Link>
        <span className="font-mono text-[0.6875rem] tabular-nums text-ink-faint">
          {report.reportNumber}
        </span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.5rem]">
            {report.title}
          </h1>
          <p className="mt-1.5 text-body-sm text-ink-muted">
            {LABELS.bugFiledOn} {formatOrderDate(report.createdAt)}
            {report.reporterName ? ` · ${report.reporterName}` : ""}
            {mode === "admin" && report.assignedToName
              ? ` · ${report.assignedToName}`
              : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={report.status}
            label={BUG_STATUS_LABEL[report.status]}
          />
          {mode === "admin" ? (
            <>
              <StatusBadge
                status={report.severity ?? "NONE"}
                label={
                  report.severity
                    ? BUG_SEVERITY_LABEL[report.severity]
                    : LABELS.bugSeverityNone
                }
              />
              <StatusBadge
                status={report.affectedModule}
                label={BUG_MODULE_LABEL[report.affectedModule]}
              />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
