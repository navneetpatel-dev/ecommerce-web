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
};

export type DataTablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Optional result summary (server or client). */
  total?: number;
  from?: number;
  to?: number;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  title?: ReactNode;
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
  /** Optional row activation handler (e.g. navigate to detail). Takes precedence over the detail modal. */
  onRowClick?: (row: T, index: number) => void;
};
