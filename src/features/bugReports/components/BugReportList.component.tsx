"use client";

import { LABELS } from "@/shared/constants/labels";
import { KeysetDataTable } from "@/shared/components/KeysetDataTable.component";
import type { BugReport } from "../api/bugReports.api";
import { useBugReportTableColumns } from "./useBugReportTableColumns.hook";
import { useBugReportListHandlers } from "./useBugReportListHandlers.hook";

interface BugReportListProps {
  reports: BugReport[];
  detailHref: (id: string) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  toolbar?: React.ReactNode;
  title?: React.ReactNode;
  showSeverity?: boolean;
  showReporter?: boolean;
  showModule?: boolean;
}

export function BugReportList({
  reports,
  detailHref,
  isLoading,
  isError,
  errorMessage,
  emptyMessage = LABELS.bugReportsEmpty,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRefresh,
  toolbar,
  title,
  showSeverity,
  showReporter,
  showModule,
}: BugReportListProps) {
  const columns = useBugReportTableColumns({
    showReporter,
    showModule,
    showSeverity,
  });
  const { handleRowClick, getRowId } = useBugReportListHandlers(detailHref);

  return (
    <KeysetDataTable
      title={title}
      toolbar={toolbar}
      columns={columns}
      rows={reports}
      getRowId={getRowId}
      loading={isLoading}
      error={isError ? errorMessage || LABELS.bugCouldNotLoad : null}
      emptyMessage={emptyMessage}
      onRefresh={onRefresh}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={onLoadMore}
      onRowClick={handleRowClick}
    />
  );
}
