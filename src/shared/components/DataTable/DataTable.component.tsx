"use client";

import { useState, type KeyboardEvent } from "react";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { RecordDetailDialog } from "@/shared/components/RecordDetailDialog.component";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { DataTableDesktopTable } from "./DataTableDesktopTable.component";
import { DataTableHeader } from "./DataTableHeader.component";
import { DataTableMobileCards } from "./DataTableMobileCards.component";
import type { DataTableProps } from "./types";
import { toDetailRecord } from "./utils.component";

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  error = null,
  emptyMessage = LABELS.noRecordsFound,
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
      <section className={cn("min-w-0 space-y-5", className)}>
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

        {error ? <p className="text-body text-danger">{error}</p> : null}

        {loading ? (
          <SkeletonRows count={6} height="h-12 w-full" />
        ) : rows.length === 0 ? (
          <div className="rounded-md border border-line bg-surface px-4 py-14 text-center text-ink-muted">
            {emptyMessage}
          </div>
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
              actions={actions}
              actionsHeader={actionsHeader}
              actionsClassName={actionsClassName}
              onActivateRow={activateRow}
              onRowKeyDown={onRowKeyDown}
            />
          </>
        )}

        {pagination != null ? (
          <div className="flex justify-center border-t border-line/70 pt-2">
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
            onOpenChange={(open) => {
              if (!open) setDetailRow(null);
            }}
            record={detailRow ? toDetailRecord(detailRow) : null}
          />
        ) : null}
      </section>
    </TooltipProvider>
  );
}
