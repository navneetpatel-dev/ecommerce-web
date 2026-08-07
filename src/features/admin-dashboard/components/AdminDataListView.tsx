import type { ReactNode } from 'react'
import {
  DataTable,
  type DataTableColumn,
} from '@/shared/components/DataTable'
import { LABELS } from '@/shared/constants/labels'
import { inferAdminColumns, type AdminDataRow } from '../hooks/useAdminDataList'
import { formatAdminCellValue, getAdminCellValue } from '../utils/adminTableCells'

interface AdminDataListViewProps {
  title: string
  rows: AdminDataRow[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  page: number
  totalPages: number
  total: number
  from: number
  to: number
  onPageChange: (page: number) => void
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode
  /** Prefer explicit columns; falls back to inferred keys from the first row. */
  columnKeys?: string[]
}

function columnHeader(key: string): string {
  const leaf = key.includes('.') ? key.split('.').pop()! : key
  const labels = LABELS as Record<string, string>
  return labels[leaf] ?? labels[key] ?? leaf
}

export function AdminDataListView({
  title,
  rows,
  loading,
  error,
  onRefresh,
  page,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  actions,
  columnKeys,
}: AdminDataListViewProps) {
  const keys = columnKeys ?? inferAdminColumns(rows)
  const columns: DataTableColumn<AdminDataRow>[] = keys.map((key) => ({
    id: key,
    header: columnHeader(key),
    truncate: true,
    cell: (row) => formatAdminCellValue(getAdminCellValue(row, key)),
  }))

  return (
    <DataTable
      title={title}
      columns={columns}
      rows={rows}
      loading={loading}
      error={error}
      emptyMessage={LABELS.noRecordsFound}
      onRefresh={onRefresh}
      getRowId={(row, index) => String(row.id ?? index)}
      pagination={{
        page,
        totalPages,
        total,
        from,
        to,
        onPageChange,
      }}
      actions={actions ? (row) => actions(row, onRefresh) : undefined}
    />
  )
}
