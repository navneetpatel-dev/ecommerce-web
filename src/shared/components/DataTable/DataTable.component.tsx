"use client";

import { useState, type KeyboardEvent } from "react";
import { Inbox } from "lucide-react";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { RecordDetailDialog } from "@/shared/components/dialogs/RecordDetailDialog.component";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableStyles } from "../../styles/data-table/dataTable.styles";
import { DataTableDesktopTable } from "./DataTableDesktopTable.component";
import { DataTableHeader } from "./DataTableHeader.component";
import { DataTableMobileCards } from "./DataTableMobileCards.component";
import type { DataTableProps } from "../../types/data-table/types";
import { toDetailRecord } from "./utils.component";

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  refreshing = false,
  error = null,
  emptyMessage = LABELS.noRecordsFound,
  ariaLabel,
  title,
  toolbar,
  onRefresh,
  pagination,
  actions,
  actionsHeader = LABELS.actions,
  actionsClassName,
  className,
  tableLayout = "auto",
  rowDetails = true,
  onRowClick,
}: DataTableProps<T>) {
  const [detailRow, setDetailRow] = useState<T | null>(null);

  const handleDetailOpenChange = (open: boolean) => {
    if (!open) setDetailRow(null);
  };

  const resolvedAriaLabel =
    ariaLabel ?? (typeof title === "string" ? title : undefined);

  const showSummary =
    Boolean(pagination) &&
    pagination?.total != null &&
    pagination?.from != null &&
    pagination?.to != null &&
    pagination.total > 0;

  const rowsInteractive = Boolean(onRowClick) || rowDetails;

  const activateRow = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
      return;
    }
    if (rowDetails) setDetailRow(row);
  };

  const onRowKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    row: T,
    index: number,
  ) => {
    if (!rowsInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateRow(row, index);
    }
  };

  return (
    <TooltipProvider delayDuration={250}>
      <section
        aria-busy={loading || refreshing || undefined}
        className={cn(dataTableStyles.section, className)}
      >
        {(title || onRefresh || toolbar || showSummary) && (
          <DataTableHeader
            title={title}
            toolbar={toolbar}
            onRefresh={onRefresh}
            from={pagination?.from}
            to={pagination?.to}
            total={pagination?.total}
          />
        )}

        {error ? (
          <div className={dataTableStyles.errorBox}>
            <QueryErrorAlert
              error={error}
              fallback={error}
              onRetry={onRefresh}
            />
          </div>
        ) : null}

        {refreshing && !loading ? (
          <span role="status" className={dataTableStyles.loadingHint}>
            {LABELS.refreshing}
          </span>
        ) : null}

        {loading ? (
          <>
            <span className={dataTableStyles.loadingHint}>
              {LABELS.loading}
            </span>
            <SkeletonRows count={6} height={dataTableStyles.skeletonHeight} />
          </>
        ) : rows.length === 0 ? (
          <EmptyState icon={Inbox} message={emptyMessage} />
        ) : (
          <>
            {/* Below lg: stacked cards — row actions collapse to kebab */}
            <DataTableMobileCards
              columns={columns}
              rows={rows}
              getRowId={getRowId}
              rowsInteractive={rowsInteractive}
              actions={actions}
              onActivateRow={activateRow}
              onRowKeyDown={onRowKeyDown}
            />

            {/* lg+: scrollable data columns + pinned actions */}
            <DataTableDesktopTable
              columns={columns}
              rows={rows}
              getRowId={getRowId}
              tableLayout={tableLayout}
              rowsInteractive={rowsInteractive}
              ariaLabel={resolvedAriaLabel}
              actions={actions}
              actionsHeader={actionsHeader}
              actionsClassName={actionsClassName}
              onActivateRow={activateRow}
              onRowKeyDown={onRowKeyDown}
            />
          </>
        )}

        {pagination != null ? (
          <div className={dataTableStyles.paginationWrapper}>
            <PaginationContainer
              currentPage={pagination.page}
              totalPages={Math.max(1, pagination.totalPages)}
              onPageChange={pagination.onPageChange}
            />
          </div>
        ) : null}

        {rowDetails ? (
          <RecordDetailDialog
            open={detailRow != null}
            onOpenChange={handleDetailOpenChange}
            record={detailRow ? toDetailRecord(detailRow) : null}
          />
        ) : null}
      </section>
    </TooltipProvider>
  );
}
