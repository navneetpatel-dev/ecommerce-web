'use client'

import { useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { SkeletonRows } from '@/shared/components/Skeletons'
import { Button } from '@/shared/components/ui/button'
import { TruncatedText } from '@/shared/components/TruncatedText'
import { RecordDetailDialog } from '@/shared/components/RecordDetailDialog'
import { TooltipProvider } from '@/shared/components/ui/tooltip'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { LABELS } from '@/shared/constants/labels'
import { TABLE_CELL_MAX_CHARS } from '@/shared/constants/table'
import { formatLabel } from '@/shared/utils/formatLabel'
import { tryFormatDateTime } from '@/shared/utils/formatDate'
import { cn } from '@/shared/utils/cn'

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  /** Prefer `cell` for custom render; `accessor` for simple field lookup. */
  accessor?: keyof T
  cell?: (row: T, index: number) => ReactNode
  className?: string
  headerClassName?: string
  /** Truncate long text with hover tooltip (default true for string/number cells). */
  truncate?: boolean
  /** Override default character limit when truncating. */
  maxChars?: number
  /** Optional label for mobile card rows when `header` is not a string. */
  mobileLabel?: string
  /** Hide this column in the mobile card list (still shown in table). */
  hideOnMobile?: boolean
}

export type DataTablePaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Optional result summary (server or client). */
  total?: number
  from?: number
  to?: number
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId?: (row: T, index: number) => string
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  title?: ReactNode
  toolbar?: ReactNode
  onRefresh?: () => void
  pagination?: DataTablePaginationProps
  actions?: (row: T, index: number) => ReactNode
  actionsHeader?: ReactNode
  /** Extra classes for the actions column header/cells (e.g. wider for multi-button rows). */
  actionsClassName?: string
  className?: string
  /** Use fixed layout so wide cells truncate instead of expanding the page. */
  tableLayout?: 'auto' | 'fixed'
  /**
   * When true (default), rows are clickable and open a detail modal with all record fields.
   * Set false for tables that should not open row details.
   */
  rowDetails?: boolean
}

function resolveCell<T>(column: DataTableColumn<T>, row: T, index: number): ReactNode {
  if (column.cell) {
    const content = column.cell(row, index)
    if (typeof content === 'string' || typeof content === 'number') {
      const asDate = tryFormatDateTime(content)
      if (asDate) return asDate
    }
    return content
  }
  if (column.accessor != null) {
    const value = row[column.accessor]
    if (value == null || value === '') return '—'
    const asDate = tryFormatDateTime(value)
    if (asDate) return asDate
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }
  return '—'
}

function columnLabel<T>(column: DataTableColumn<T>): string {
  if (column.mobileLabel) return column.mobileLabel
  if (typeof column.header === 'string' || typeof column.header === 'number') {
    return String(column.header)
  }
  return column.id
}

function renderCellContent<T>(column: DataTableColumn<T>, content: ReactNode): ReactNode {
  const shouldTruncate =
    column.truncate !== false && (typeof content === 'string' || typeof content === 'number')

  if (!shouldTruncate) return content

  const text = String(content)
  if (text === '—') return text

  return (
    <TruncatedText maxChars={column.maxChars ?? TABLE_CELL_MAX_CHARS}>{text}</TruncatedText>
  )
}

function toDetailRecord<T>(row: T): Record<string, unknown> {
  if (row != null && typeof row === 'object') {
    return row as Record<string, unknown>
  }
  return { value: row as unknown }
}

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
  tableLayout = 'fixed',
  rowDetails = true,
}: DataTableProps<T>) {
  const [detailRow, setDetailRow] = useState<T | null>(null)
  const mobileColumns = columns.filter((column) => !column.hideOnMobile)
  const showSummary =
    pagination &&
    pagination.total != null &&
    pagination.from != null &&
    pagination.to != null &&
    pagination.total > 0

  const openDetails = (row: T) => {
    if (!rowDetails) return
    setDetailRow(row)
  }

  const onRowKeyDown = (event: KeyboardEvent<HTMLElement>, row: T) => {
    if (!rowDetails) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDetails(row)
    }
  }

  return (
    <TooltipProvider delayDuration={250}>
      <section className={cn('min-w-0 space-y-5', className)}>
        {(title || onRefresh || toolbar || showSummary) && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              {title ? (
                typeof title === 'string' ? (
                  <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                    {title}
                  </h1>
                ) : (
                  title
                )
              ) : null}
              {showSummary ? (
                <p className="text-[0.8125rem] text-ink-muted">
                  {formatLabel(LABELS.showingResults, {
                    from: pagination.from!,
                    to: pagination.to!,
                    total: pagination.total!,
                  })}
                </p>
              ) : null}
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              {toolbar}
              {onRefresh ? (
                <Button variant="secondary" className="w-full sm:w-auto" onClick={onRefresh}>
                  {LABELS.refresh}
                </Button>
              ) : null}
            </div>
          </div>
        )}

        {error ? <p className="text-[0.9375rem] text-danger">{error}</p> : null}

        {loading ? (
          <SkeletonRows count={6} height="h-12 w-full" />
        ) : rows.length === 0 ? (
          <div className="rounded-md border border-line bg-surface px-4 py-14 text-center text-ink-muted">
            {emptyMessage}
          </div>
        ) : (
          <>
            {/* Mobile / narrow: stacked cards */}
            <ul className="space-y-3 md:hidden">
              {rows.map((row, index) => {
                const rowId = getRowId?.(row, index) ?? String((row as { id?: unknown }).id ?? index)
                const [primary, ...rest] = mobileColumns
                const primaryContent = primary ? resolveCell(primary, row, index) : null

                return (
                  <li
                    key={rowId}
                    className={cn(
                      'rounded-md border border-line bg-surface p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]',
                      rowDetails &&
                        'cursor-pointer transition-colors hover:border-brand/30 hover:bg-brand-subtle/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    )}
                    role={rowDetails ? 'button' : undefined}
                    tabIndex={rowDetails ? 0 : undefined}
                    aria-label={rowDetails ? LABELS.viewRecordDetails : undefined}
                    onClick={() => openDetails(row)}
                    onKeyDown={(event) => onRowKeyDown(event, row)}
                  >
                    {primary ? (
                      <div className={cn('min-w-0 text-[0.9375rem] text-ink', primary.className)}>
                        {renderCellContent(primary, primaryContent)}
                      </div>
                    ) : null}

                    {rest.length > 0 ? (
                      <dl
                        className={cn(
                          'space-y-2.5',
                          primary ? 'mt-3 border-t border-line/80 pt-3' : undefined,
                        )}
                      >
                        {rest.map((column) => {
                          const content = resolveCell(column, row, index)
                          return (
                            <div
                              key={column.id}
                              className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-x-3 gap-y-1"
                            >
                              <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
                                {columnLabel(column)}
                              </dt>
                              <dd
                                className={cn(
                                  'min-w-0 break-words text-[0.875rem] text-ink',
                                  column.className,
                                )}
                              >
                                {renderCellContent(column, content)}
                              </dd>
                            </div>
                          )
                        })}
                      </dl>
                    ) : null}

                    {actions ? (
                      <div
                        className={cn(
                          'flex flex-wrap gap-2',
                          primary || rest.length > 0 ? 'mt-4 border-t border-line/80 pt-3' : undefined,
                        )}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        {actions(row, index)}
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>

            {/* md+: classic table */}
            <div className="hidden overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_0_rgba(15,23,42,0.03)] md:block">
              <Table className={cn(tableLayout === 'fixed' && 'table-fixed')}>
                <TableHeader>
                  <TableRow className="border-line bg-paper/70 hover:bg-paper/70">
                    {columns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={cn(
                          'text-[0.75rem] uppercase tracking-[0.04em]',
                          column.headerClassName,
                        )}
                      >
                        {column.header}
                      </TableHead>
                    ))}
                    {actions ? (
                      <TableHead
                        className={cn(
                          'min-w-[9rem] whitespace-nowrap text-center text-[0.75rem] uppercase tracking-[0.04em]',
                          actionsClassName,
                        )}
                      >
                        {actionsHeader}
                      </TableHead>
                    ) : null}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, index) => {
                    const rowId =
                      getRowId?.(row, index) ?? String((row as { id?: unknown }).id ?? index)
                    return (
                      <TableRow
                        key={rowId}
                        className={cn(
                          rowDetails &&
                            'cursor-pointer hover:bg-brand-subtle/25 focus-visible:bg-brand-subtle/25',
                        )}
                        tabIndex={rowDetails ? 0 : undefined}
                        aria-label={rowDetails ? LABELS.viewRecordDetails : undefined}
                        onClick={() => openDetails(row)}
                        onKeyDown={(event) => onRowKeyDown(event, row)}
                      >
                        {columns.map((column) => {
                          const content = resolveCell(column, row, index)
                          return (
                            <TableCell
                              key={column.id}
                              className={cn(tableLayout === 'fixed' && 'max-w-0', column.className)}
                            >
                              {renderCellContent(column, content)}
                            </TableCell>
                          )
                        })}
                        {actions ? (
                          <TableCell
                            className={cn(
                              'min-w-[9rem] whitespace-nowrap text-center align-middle',
                              actionsClassName,
                            )}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              {actions(row, index)}
                            </div>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {pagination != null &&
        (pagination.total == null ? pagination.totalPages >= 1 : pagination.total > 0) ? (
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
              if (!open) setDetailRow(null)
            }}
            record={detailRow ? toDetailRecord(detailRow) : null}
          />
        ) : null}
      </section>
    </TooltipProvider>
  )
}
