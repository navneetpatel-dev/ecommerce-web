import type { ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import type { AdminDataRow } from '../hooks/useAdminDataList'

interface AdminDataListViewProps {
  title: string
  rows: AdminDataRow[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode
}

function formatCellValue(value: unknown): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function AdminDataListView({
  title,
  rows,
  loading,
  error,
  onRefresh,
  actions,
}: AdminDataListViewProps) {
  const columns = rows[0] ? Object.keys(rows[0]).slice(0, 6) : []

  return (
    <section className="min-w-0 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        <Button variant="secondary" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      {loading && <p className="text-ink-muted">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !rows.length && <p className="py-8 text-center text-ink-muted">No records found.</p>}
      {rows.length > 0 && (
        <div className="min-w-0 max-w-full overflow-x-auto border border-line">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b border-line bg-paper/60">
              <tr>
                {columns.map((key) => (
                  <th key={key} className="px-4 py-3 font-medium text-ink-muted">
                    <span className="block truncate" title={key}>
                      {key}
                    </span>
                  </th>
                ))}
                {actions && (
                  <th className="w-28 px-4 py-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-b border-line last:border-0">
                  {columns.map((key) => {
                    const text = formatCellValue(row[key])
                    return (
                      <td key={key} className="max-w-0 px-4 py-3 text-ink">
                        <span className="block truncate" title={text}>
                          {text}
                        </span>
                      </td>
                    )
                  })}
                  {actions && (
                    <td className="whitespace-nowrap px-4 py-3">{actions(row, onRefresh)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
