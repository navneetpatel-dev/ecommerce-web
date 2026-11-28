"use client";

import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { dataTableStyles } from "../../styles/data-table/dataTable.styles";
import { DataTableBody } from "./DataTableBody.component";
import { DataTableDetailDialog } from "./DataTableDetailDialog.component";
import { DataTableFooter } from "./DataTableFooter.component";
import { DataTableHeader } from "./DataTableHeader.component";
import { DataTableHeaderTools } from "./DataTableHeaderTools.component";
import { useRowDetailFetcher } from "./hooks/useRowDetailFetcher.hook";
import { useTableFullscreen } from "./hooks/useTableFullscreen.hook";
import { useTableRowActivation } from "./hooks/useTableRowActivation.hook";
import { useTableSelection } from "./hooks/useTableSelection.hook";
import { useTableSorting } from "./hooks/useTableSorting.hook";
import { useTableViewPreferences } from "./hooks/useTableViewPreferences.hook";
import type { DataTableProps } from "../../types/data-table/types";

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
  showViewButton,
  fetchRowDetail,
  detailFieldLinks,
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
  const detail = useRowDetailFetcher({ fetchRowDetail, getRowId });
  const { isFullscreen, toggleFullscreen } = useTableFullscreen();
  const view = useTableViewPreferences({
    columns,
    tableId,
    density: controlledDensity,
    onDensityChange,
    visibleColumnIds: controlledVisibleColumnIds,
    onVisibleColumnIdsChange,
  });
  const { sortStates, sortedRows, handleSortColumn } = useTableSorting({
    rows,
    enableSorting,
    sortStates: controlledSortStates,
    onSortChange,
    orderedColumns: view.orderedColumns,
  });
  const selection = useTableSelection({
    rows,
    getRowId,
    selectedIds: controlledSelectedIds,
    onSelectionChange,
  });
  const { selectedIds, handleClearSelection } = selection;
  const rowActivation = useTableRowActivation({
    sortedRows,
    getRowId,
    onRowClick,
    actions,
    showViewButton,
    rowDetails,
    selectable,
    enableKeyboardNavigation,
    openDetailRow: detail.openRow,
    onToggleSelectRow: selection.handleToggleSelectRow,
  });

  const resolvedAriaLabel =
    ariaLabel ?? (typeof title === "string" ? title : undefined);

  const showSummary =
    Boolean(pagination) &&
    pagination?.total != null &&
    pagination?.from != null &&
    pagination?.to != null &&
    pagination.total > 0;

  const hasExtraHeaderTools =
    enableDensityToggle || enableColumnVisibility || enableExport;
  const headerToolbar = (
    <DataTableHeaderTools
      {...view}
      toolbar={toolbar}
      enableDensityToggle={enableDensityToggle}
      enableColumnVisibility={enableColumnVisibility}
      enableExport={enableExport}
      sortedRows={sortedRows}
      selectedIds={selectedIds}
      getRowId={getRowId}
      exportFilename={exportFilename}
      title={title}
    />
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
            onToggleFullscreen={enableFullscreen ? toggleFullscreen : undefined}
          />
        )}

        <DataTableBody
          {...view}
          {...selection}
          {...rowActivation}
          loading={loading}
          refreshing={refreshing}
          error={error}
          emptyMessage={emptyMessage}
          onRefresh={onRefresh}
          sortedRows={sortedRows}
          getRowId={getRowId}
          tableLayout={tableLayout}
          selectable={selectable}
          stickyHeader={stickyHeader}
          resolvedAriaLabel={resolvedAriaLabel}
          actions={actions}
          actionsHeader={actionsHeader}
          actionsClassName={actionsClassName}
          enableSorting={enableSorting}
          sortStates={sortStates}
          handleSortColumn={handleSortColumn}
        />

        <DataTableFooter
          pagination={pagination}
          selectable={selectable}
          selectedIds={selectedIds}
          totalCount={pagination?.total ?? sortedRows.length}
          onClearSelection={handleClearSelection}
          bulkActions={bulkActions}
        />

        <DataTableDetailDialog
          enabled={rowDetails}
          detail={detail}
          fieldLinks={detailFieldLinks}
        />
      </section>
    </TooltipProvider>
  );
}
