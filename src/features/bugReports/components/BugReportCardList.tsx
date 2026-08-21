"use client";

import Link from "next/link";
import { Bug } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { FormError } from "@/shared/components/FormError";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { InfiniteLoadMore } from "@/shared/components/InfiniteLoadMore";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { BUG_SEVERITY_LABEL, BUG_STATUS_LABEL } from "../utils/labels";
import type { BugReport } from "../api/bugReports.api";

type Props = {
  reports: BugReport[];
  detailHref: (id: string) => string;
  createHref: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

export function BugReportCardList({
  reports,
  detailHref,
  createHref,
  isLoading,
  isError,
  errorMessage,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <FormError
        error={new Error(errorMessage || LABELS.bugCouldNotLoad)}
        fallback={LABELS.bugCouldNotLoad}
      />
    );
  }

  if (reports.length === 0) {
    return (
      <div className="border border-dashed border-line bg-paper/50">
        <EmptyState
          icon={Bug}
          heading={LABELS.bugReportsEmpty}
          message={LABELS.bugReportsEmptyMessage}
          actionLabel={LABELS.reportABug}
          actionTo={createHref}
          className="py-14"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <li key={report.id} className="min-w-0">
            <Link
              href={detailHref(report.id)}
              className="group flex h-full flex-col border border-line bg-surface-raised px-4 py-4 transition-colors hover:border-brand/40 hover:bg-brand-subtle/30 sm:px-5"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-[0.75rem] tabular-nums text-ink-muted">
                    {report.reportNumber}
                  </span>
                  <StatusBadge
                    status={report.status}
                    label={BUG_STATUS_LABEL[report.status]}
                  />
                  {report.severity ? (
                    <StatusBadge
                      status={report.severity}
                      label={BUG_SEVERITY_LABEL[report.severity]}
                    />
                  ) : report.status !== BUG_REPORT_STATUS.NEW ? (
                    <StatusBadge status="NONE" label={LABELS.bugSeverityNone} />
                  ) : null}
                </div>
                <p className="line-clamp-2 font-medium text-ink group-hover:text-brand">
                  {report.title}
                </p>
                <p className="line-clamp-2 text-[0.875rem] text-ink-muted">
                  {report.description}
                </p>
                <p className="text-[0.8125rem] text-ink-faint">
                  {formatOrderDate(report.createdAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <InfiniteLoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  );
}
