'use client'

import type { ReactNode } from 'react'
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
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { cn } from '@/shared/utils/cn'

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  /** Prefer `cell` for custom render; `accessor` for simple field lookup. */
  accessor?: keyof T
  cell?: (row: T, index: number) => ReactNode
  className?: string
  headerClassName?: string
  /** Truncate long text with native tooltip (default true for string cells). */
  truncate?: boolean
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
}

function resolveCell<T>(column: DataTableColumn<T>, row: T, index: number): ReactNode {
  if (column.cell) return column.cell(row, index)
  if (column.accessor != null) {
    const value = row[column.accessor]
    if (value == null || value === '') return '—'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }
  return '—'
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
}: DataTableProps<T>) {
  const colCount = columns.length + (actions ? 1 : 0)
  const showSummary =
    pagination &&
    pagination.total != null &&
    pagination.from != null &&
    pagination.to != null &&
    pagination.total > 0

  return (
    <section className={cn('min-w-0 space-y-5', className)}>
      {(title || onRefresh || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {title ? (
              typeof title === 'string' ? (
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
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
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            {onRefresh ? (
              <Button variant="secondary" onClick={onRefresh}>
                {LABELS.refresh}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {error ? <p className="text-[0.9375rem] text-danger">{error}</p> : null}

      {loading ? (
        <SkeletonRows count={6} height="h-12 w-full" />
      ) : (
        <div className="overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_0_rgba(15,23,42,0.03)]">
          <Table className={cn(tableLayout === 'fixed' && 'table-fixed')}>
            <TableHeader>
              <TableRow className="border-line bg-paper/70 hover:bg-paper/70">
                {columns.map((column) => (
                  <TableHead key={column.id} className={cn('text-[0.75rem] uppercase tracking-[0.04em]', column.headerClassName)}>
                    {column.header}
                  </TableHead>
                ))}
                {actions ? (
                  <TableHead
                    className={cn(
                      'w-56 whitespace-nowrap text-center text-[0.75rem] uppercase tracking-[0.04em]',
                      actionsClassName,
                    )}
                  >
                    {actionsHeader}
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colCount} className="py-14 text-center text-ink-muted">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => {
                  const rowId = getRowId?.(row, index) ?? String((row as { id?: unknown }).id ?? index)
                  return (
                    <TableRow key={rowId}>
                      {columns.map((column) => {
                        const content = resolveCell(column, row, index)
                        const shouldTruncate =
                          column.truncate !== false &&
                          (typeof content === 'string' || typeof content === 'number')
                        return (
                          <TableCell
                            key={column.id}
                            className={cn(tableLayout === 'fixed' && 'max-w-0', column.className)}
                          >
                            {shouldTruncate ? (
                              <span className="block truncate" title={String(content)}>
                                {content}
                              </span>
                            ) : (
                              content
                            )}
                          </TableCell>
                        )
                      })}
                      {actions ? (
                        <TableCell
                          className={cn(
                            'w-56 whitespace-nowrap text-center align-middle',
                            actionsClassName,
                          )}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {actions(row, index)}
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex justify-center border-t border-line/70 pt-2">
          <PaginationContainer
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      ) : null}
    </section>
  )
}
