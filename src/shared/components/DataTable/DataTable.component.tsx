"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
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
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown.component";
import { DataTableDesktopTable } from "./DataTableDesktopTable.component";
import { DataTableHeader } from "./DataTableHeader.component";
import { DataTableMobileCards } from "./DataTableMobileCards.component";
import { FloatingBulkActionBar } from "./FloatingBulkActionBar.component";
import { RowDensityToggle } from "./RowDensityToggle.component";
import { TableExportDropdown } from "./TableExportDropdown.component";
import { useTableKeyboardNavigation } from "./hooks/useTableKeyboardNavigation.hook";
import { useRowDetailFetcher } from "./hooks/useRowDetailFetcher.hook";
import type {
  ColumnSortState,
  DataTableColumn,
  DataTableProps,
  TableDensity,
} from "../../types/data-table/types";
import { resolveCell } from "./utils.component";

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
  titleLevel = 1,
  toolbar,
  onRefresh,
  pagination,
  actions,
  actionsHeader = LABELS.actions,
  actionsClassName,
  className,
  tableLayout = "auto",
  rowDetails = true,
  fetchRowDetail,
  onRowClick,
  tableId,
  enableColumnVisibility = false,
  visibleColumnIds: controlledVisibleColumnIds,
  onVisibleColumnIdsChange,
  enableDensityToggle = false,
  density: controlledDensity,
  onDensityChange,
  selectable = false,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  bulkActions,
  enableExport = false,
  exportFilename,
  stickyHeader = true,
  enableKeyboardNavigation = true,
  enableSorting = false,
  sortStates: controlledSortStates,
  onSortChange,
  enableFullscreen = true,
}: DataTableProps<T>) {
  const {
    detailRow,
    detailRecord,
    isLoading: isDetailLoading,
    error: detailError,
    openRow: openDetailRow,
    close: closeDetail,
  } = useRowDetailFetcher({ fetchRowDetail, getRowId });

  // Density state
  const [internalDensity, setInternalDensity] =
    useState<TableDensity>("comfortable");
  const density = controlledDensity ?? internalDensity;

  // Column order state
  const allColumnIds = useMemo(() => columns.map((col) => col.id), [columns]);
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<string[]>(allColumnIds);

  // Column visibility state
  const [internalVisibleColumnIds, setInternalVisibleColumnIds] =
    useState<string[]>(allColumnIds);
  const visibleColumnIds =
    controlledVisibleColumnIds ?? internalVisibleColumnIds;

  // Fullscreen zen mode state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Multi-column sorting state
  const [internalSortStates, setInternalSortStates] = useState<
    ColumnSortState[]
  >([]);
  const sortStates = controlledSortStates ?? internalSortStates;

  // Selection state
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const selectedIds = controlledSelectedIds ?? internalSelectedIds;

  // Fullscreen escape key listener
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Persistence for tableId (Density, Columns, Order)
  useEffect(() => {
    if (!tableId) return;
    try {
      const storedDensity = localStorage.getItem(
        `datatable-density:${tableId}`,
      );
      if (storedDensity === "comfortable" || storedDensity === "compact") {
        setInternalDensity(storedDensity);
      }

      const storedCols = localStorage.getItem(`datatable-cols:${tableId}`);
      if (storedCols) {
        const parsed = JSON.parse(storedCols);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((id) => allColumnIds.includes(id));
          if (valid.length > 0) {
            setInternalVisibleColumnIds(valid);
          }
        }
      }

      const storedOrder = localStorage.getItem(`datatable-order:${tableId}`);
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((id) => allColumnIds.includes(id));
          const missing = allColumnIds.filter((id) => !valid.includes(id));
          setInternalColumnOrder([...valid, ...missing]);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [tableId, allColumnIds]);

  const handleDensityChange = (newDensity: TableDensity) => {
    if (controlledDensity === undefined) {
      setInternalDensity(newDensity);
    }
    onDensityChange?.(newDensity);
    if (tableId) {
      try {
        localStorage.setItem(`datatable-density:${tableId}`, newDensity);
      } catch {
        // Storage full/blocked
      }
    }
  };

  const handleVisibleColumnIdsChange = (newIds: string[]) => {
    if (controlledVisibleColumnIds === undefined) {
      setInternalVisibleColumnIds(newIds);
    }
    onVisibleColumnIdsChange?.(newIds);
    if (tableId) {
      try {
        localStorage.setItem(
          `datatable-cols:${tableId}`,
          JSON.stringify(newIds),
        );
      } catch {
        // Storage full/blocked
      }
    }
  };

  const handleResetColumnVisibility = () => {
    handleVisibleColumnIdsChange(allColumnIds);
  };

  const handleColumnOrderChange = (newOrder: string[]) => {
    setInternalColumnOrder(newOrder);
    if (tableId) {
      try {
        localStorage.setItem(
          `datatable-order:${tableId}`,
          JSON.stringify(newOrder),
        );
      } catch {
        // Storage unavailable
      }
    }
  };

  const handleSortColumn = (colId: string, isMultiSort: boolean) => {
    let nextSorts: ColumnSortState[] = [];
    const existingIndex = sortStates.findIndex((s) => s.columnId === colId);
    const existing = sortStates[existingIndex];

    if (!isMultiSort) {
      if (!existing) {
        nextSorts = [{ columnId: colId, direction: "asc" }];
      } else if (existing.direction === "asc") {
        nextSorts = [{ columnId: colId, direction: "desc" }];
      } else {
        nextSorts = [];
      }
    } else {
      if (!existing) {
        nextSorts = [...sortStates, { columnId: colId, direction: "asc" }];
      } else if (existing.direction === "asc") {
        nextSorts = sortStates.map((s, idx) =>
          idx === existingIndex ? { ...s, direction: "desc" as const } : s,
        );
      } else {
        nextSorts = sortStates.filter((s) => s.columnId !== colId);
      }
    }

    if (controlledSortStates === undefined) {
      setInternalSortStates(nextSorts);
    }
    onSortChange?.(nextSorts);
  };

  // Reorder columns based on columnOrder
  const orderedColumns = useMemo(() => {
    if (!internalColumnOrder || internalColumnOrder.length === 0)
      return columns;
    const colMap = new Map(columns.map((c) => [c.id, c]));
    const result: DataTableColumn<T>[] = [];
    for (const id of internalColumnOrder) {
      const col = colMap.get(id);
      if (col) {
        result.push(col);
        colMap.delete(id);
      }
    }
    for (const col of colMap.values()) {
      result.push(col);
    }
    return result;
  }, [columns, internalColumnOrder]);

  const activeColumns = orderedColumns.filter((col) =>
    visibleColumnIds.includes(col.id),
  );
  const resolvedColumns =
    activeColumns.length > 0 ? activeColumns : orderedColumns;

  // Client-side multi-sorting of rows
  const sortedRows = useMemo(() => {
    if (!enableSorting || !sortStates || sortStates.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const sort of sortStates) {
        const col = orderedColumns.find((c) => c.id === sort.columnId);
        if (!col) continue;
        const rawA = col.accessor ? a[col.accessor] : resolveCell(col, a, 0);
        const rawB = col.accessor ? b[col.accessor] : resolveCell(col, b, 0);
        if (rawA === rawB) continue;
        if (rawA == null) return 1;
        if (rawB == null) return -1;
        const strA =
          typeof rawA === "object" ? JSON.stringify(rawA) : String(rawA);
        const strB =
          typeof rawB === "object" ? JSON.stringify(rawB) : String(rawB);
        const cmp = strA.localeCompare(strB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        if (cmp !== 0) {
          return sort.direction === "asc" ? cmp : -cmp;
        }
      }
      return 0;
    });
  }, [rows, sortStates, orderedColumns, enableSorting]);

  // Row selection handlers
  const rowIds = rows.map(
    (row, idx) =>
      getRowId?.(row, idx) ?? String((row as { id?: unknown }).id ?? idx),
  );

  const handleToggleSelectAll = () => {
    const isAllSelected =
      rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id));
    const nextSelected = isAllSelected ? [] : [...rowIds];
    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds(nextSelected);
    }
    onSelectionChange?.(nextSelected);
  };

  const handleToggleSelectRow = (rowId: string) => {
    const nextSelected = selectedIds.includes(rowId)
      ? selectedIds.filter((id) => id !== rowId)
      : [...selectedIds, rowId];
    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds(nextSelected);
    }
    onSelectionChange?.(nextSelected);
  };

  const handleClearSelection = () => {
    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds([]);
    }
    onSelectionChange?.([]);
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
    if (onRowClick) onRowClick(row, index);
    else if (rowDetails) openDetailRow(row, index);
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

  const { focusedIndex } = useTableKeyboardNavigation({
    rows: sortedRows,
    enabled:
      enableKeyboardNavigation &&
      sortedRows.length > 0 &&
      (rowsInteractive || selectable),
    getRowId,
    onActivateRow: activateRow,
    selectable,
    onToggleSelectRow: handleToggleSelectRow,
  });

  const hasExtraHeaderTools =
    enableDensityToggle || enableColumnVisibility || enableExport;
  const headerToolbar = (
    <>
      {toolbar}
      {enableDensityToggle && (
        <RowDensityToggle density={density} onChange={handleDensityChange} />
      )}
      {enableColumnVisibility && (
        <ColumnVisibilityDropdown
          columns={orderedColumns}
          visibleColumnIds={visibleColumnIds}
          onChange={handleVisibleColumnIdsChange}
          onReset={handleResetColumnVisibility}
          onReorder={handleColumnOrderChange}
        />
      )}
      {enableExport && (
        <TableExportDropdown
          columns={orderedColumns}
          rows={sortedRows}
          selectedIds={selectedIds}
          getRowId={getRowId}
          filename={
            exportFilename ??
            (typeof title === "string"
              ? title.toLowerCase().replace(/\s+/g, "-")
              : undefined)
          }
        />
      )}
    </>
  );

  return (
    <TooltipProvider delayDuration={250}>
      <section
        aria-busy={loading || refreshing || undefined}
        className={cn(
          dataTableStyles.section,
          isFullscreen &&
            "fixed inset-0 z-50 m-0 h-screen w-screen overflow-y-auto bg-canvas p-6 shadow-2xl backdrop-blur-md animate-in fade-in-50 duration-200",
          className,
        )}
      >
        {(title ||
          onRefresh ||
          toolbar ||
          hasExtraHeaderTools ||
          showSummary) && (
          <DataTableHeader
            title={title}
            titleLevel={titleLevel}
            toolbar={headerToolbar}
            onRefresh={onRefresh}
            from={pagination?.from}
            to={pagination?.to}
            total={pagination?.total}
            isFiltered={pagination?.isFiltered}
            isFullscreen={isFullscreen}
            onToggleFullscreen={
              enableFullscreen
                ? () => setIsFullscreen((prev) => !prev)
                : undefined
            }
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
        ) : sortedRows.length === 0 ? (
          <EmptyState icon={Inbox} message={emptyMessage} />
        ) : (
          <>
            {/* Below lg: stacked cards — row actions collapse to kebab */}
            <DataTableMobileCards
              columns={resolvedColumns}
              rows={sortedRows}
              getRowId={getRowId}
              rowsInteractive={rowsInteractive}
              selectable={selectable}
              selectedIds={selectedIds}
              onToggleSelectRow={handleToggleSelectRow}
              actions={actions}
              onActivateRow={activateRow}
              onRowKeyDown={onRowKeyDown}
            />

            {/* lg+: scrollable data columns + pinned actions */}
            <DataTableDesktopTable
              columns={resolvedColumns}
              rows={sortedRows}
              getRowId={getRowId}
              tableLayout={tableLayout}
              rowsInteractive={rowsInteractive}
              density={density}
              selectable={selectable}
              selectedIds={selectedIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectRow={handleToggleSelectRow}
              stickyHeader={stickyHeader}
              focusedIndex={focusedIndex}
              ariaLabel={resolvedAriaLabel}
              actions={actions}
              actionsHeader={actionsHeader}
              actionsClassName={actionsClassName}
              enableSorting={enableSorting}
              sortStates={sortStates}
              onSortColumn={handleSortColumn}
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
              pageSize={pagination.pageSize}
              pageSizeOptions={pagination.pageSizeOptions}
              onPageSizeChange={pagination.onPageSizeChange}
            />
          </div>
        ) : null}

        {selectable && selectedIds.length > 0 && (
          <FloatingBulkActionBar
            selectedCount={selectedIds.length}
            totalCount={pagination?.total ?? sortedRows.length}
            onClearSelection={handleClearSelection}
          >
            {typeof bulkActions === "function"
              ? bulkActions(selectedIds, handleClearSelection)
              : bulkActions}
          </FloatingBulkActionBar>
        )}

        {rowDetails ? (
          <RecordDetailDialog
            open={detailRow != null}
            onOpenChange={(open) => !open && closeDetail()}
            record={detailRecord}
            loading={isDetailLoading}
            error={detailError}
          />
        ) : null}
      </section>
    </TooltipProvider>
  );
}
