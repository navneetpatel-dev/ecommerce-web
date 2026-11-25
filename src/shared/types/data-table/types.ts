import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  /** Prefer `cell` for custom render; `accessor` for simple field lookup. */
  accessor?: keyof T;
  cell?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  /** Truncate long text with hover tooltip (default true for string/number cells). */
  truncate?: boolean;
  /** Override default character limit when truncating. */
  maxChars?: number;
  /** Optional label for mobile card rows when `header` is not a string. */
  mobileLabel?: string;
  /** Extra classes for this column's mobile card row (`dt`/`dd` wrapper). */
  mobileRowClassName?: string;
  /** Hide this column in the mobile card list (still shown in table). */
  hideOnMobile?: boolean;
  /** Whether the column can be sorted (defaults to true when enableSorting is active). */
  sortable?: boolean;
};

export type TableDensity = "comfortable" | "compact";
export type SortDirection = "asc" | "desc";

export interface ColumnSortState {
  columnId: string;
  direction: SortDirection;
}

export type DataTablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Optional result summary (server or client). */
  total?: number;
  from?: number;
  to?: number;
  isFiltered?: boolean;
  /** Page size options and selection */
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  loading?: boolean;
  /** Background refetch — keeps the current rows and shows a status hint. */
  refreshing?: boolean;
  error?: string | null;
  emptyMessage?: string;
  /**
   * Accessible name for the table. Defaults to `title` when that is a string;
   * pass this for titled-less tables (e.g. widget tables under a card heading).
   */
  ariaLabel?: string;
  title?: ReactNode;
  /** A string title is the page's h1 unless the page has its own (B-62: then pass 2). */
  titleLevel?: 1 | 2;
  toolbar?: ReactNode;
  onRefresh?: () => void;
  pagination?: DataTablePaginationProps;
  actions?: (row: T, index: number) => ReactNode;
  actionsHeader?: ReactNode;
  /** Extra classes merged onto the sticky actions column header/cells. */
  actionsClassName?: string;
  className?: string;
  /** @default 'auto' — data columns scroll horizontally; actions stay pinned. */
  tableLayout?: "auto" | "fixed";
  /**
   * When true (default), rows are clickable and open a detail modal with all record fields.
   * Set false for tables that should not open row details.
   */
  rowDetails?: boolean;
  /**
   * Whether to display the generic "View" button in the table actions column.
   * Defaults to true whenever rows are interactive (rowDetails or onRowClick).
   */
  showViewButton?: boolean;
  /**
   * Optional async fetcher to retrieve the complete record when a row is viewed.
   * If omitted, RecordDetailDialog displays the row data directly.
   */
  fetchRowDetail?: (row: T) => Promise<Record<string, unknown>>;
  /** Optional link builders for fields inside RecordDetailDialog. */
  detailFieldLinks?: Record<
    string,
    (value: unknown, record: Record<string, unknown>) => string | null
  >;
  /** Optional row activation handler (e.g. navigate to detail). Takes precedence over the detail modal. */
  onRowClick?: (row: T, index: number) => void;
  /** Identifier for persisting column visibility and density in localStorage */
  tableId?: string;
  /** Whether to show the column visibility dropdown in the header */
  enableColumnVisibility?: boolean;
  /** Controlled visible column IDs */
  visibleColumnIds?: string[];
  /** Callback when visible columns change */
  onVisibleColumnIdsChange?: (ids: string[]) => void;
  /** Whether to show the row density toggle in the header */
  enableDensityToggle?: boolean;
  /** Controlled table row density */
  density?: TableDensity;
  /** Callback when density changes */
  onDensityChange?: (density: TableDensity) => void;
  /** Enable row selection */
  selectable?: boolean;
  /** Controlled selected row IDs */
  selectedIds?: string[];
  /** Callback when selected row IDs change */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Actions rendered in the floating bulk action bar when rows are selected */
  bulkActions?:
    ReactNode | ((selectedIds: string[], deselectAll: () => void) => ReactNode);
  /** Whether to show the multi-format export dropdown in the header */
  enableExport?: boolean;
  /** Custom export file name prefix */
  exportFilename?: string;
  /** Whether the table header sticks to the top during vertical scroll (default true) */
  stickyHeader?: boolean;
  /** Enable arrow keys and j/k row keyboard navigation (default true when rowsInteractive or selectable) */
  enableKeyboardNavigation?: boolean;
  /** Whether to enable column sorting (click to sort, Shift-click to multi-sort) */
  enableSorting?: boolean;
  /** Controlled sort states */
  sortStates?: ColumnSortState[];
  /** Callback when sorting changes */
  onSortChange?: (sortStates: ColumnSortState[]) => void;
  /** Whether to enable the table fullscreen toggle */
  enableFullscreen?: boolean;
};
