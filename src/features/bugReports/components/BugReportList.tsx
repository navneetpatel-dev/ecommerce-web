'use client'

import { useRouter } from 'next/navigation'
import { type DataTableColumn } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { LABELS } from '@/shared/constants/labels'
import { formatOrderDate } from '@/features/orders/utils/format'
import {
  BUG_MODULE_LABEL,
  BUG_SEVERITY_LABEL,
  BUG_STATUS_LABEL,
} from '../utils/labels'
import { KeysetDataTable } from '@/shared/components/KeysetDataTable'
import type { BugReport } from '../api/bugReports.api'

type Props = {
  reports: BugReport[]
  detailHref: (id: string) => string
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  emptyMessage?: string
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  onRefresh?: () => void
  toolbar?: React.ReactNode
  title?: React.ReactNode
  showSeverity?: boolean
  showReporter?: boolean
  showModule?: boolean
}

export function BugReportList({
  reports,
  detailHref,
  isLoading,
  isError,
  errorMessage,
  emptyMessage = LABELS.bugReportsEmpty,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRefresh,
  toolbar,
  title,
  showSeverity,
  showReporter,
  showModule,
}: Props) {
  const router = useRouter()

  const columns: DataTableColumn<BugReport>[] = [
    {
      id: 'reportNumber',
      header: LABELS.bugReportNumber,
      cell: (row) => (
        <span className="font-mono text-[0.8125rem] tabular-nums text-ink">{row.reportNumber}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      id: 'title',
      header: LABELS.bugTitle,
      cell: (row) => <span className="font-medium text-ink">{row.title}</span>,
    },
    ...(showReporter
      ? [
          {
            id: 'reporterName',
            header: LABELS.bugReporter,
            cell: (row: BugReport) => row.reporterName || LABELS.emptyCell,
            hideOnMobile: true,
          } satisfies DataTableColumn<BugReport>,
        ]
      : []),
    ...(showModule
      ? [
          {
            id: 'affectedModule',
            header: LABELS.bugAffectedModule,
            cell: (row: BugReport) => BUG_MODULE_LABEL[row.affectedModule],
            hideOnMobile: true,
          } satisfies DataTableColumn<BugReport>,
        ]
      : []),
    ...(showSeverity
      ? [
          {
            id: 'severity',
            header: LABELS.bugSeverity,
            cell: (row: BugReport) => (
              <StatusBadge
                status={row.severity ?? 'NONE'}
                label={
                  row.severity ? BUG_SEVERITY_LABEL[row.severity] : LABELS.bugSeverityNone
                }
              />
            ),
          } satisfies DataTableColumn<BugReport>,
        ]
      : []),
    {
      id: 'status',
      header: LABELS.status,
      cell: (row) => <StatusBadge status={row.status} label={BUG_STATUS_LABEL[row.status]} />,
    },
    {
      id: 'createdAt',
      header: LABELS.createdAt,
      cell: (row) => formatOrderDate(row.createdAt),
      hideOnMobile: true,
    },
  ]

  return (
    <KeysetDataTable
      title={title}
      toolbar={toolbar}
      columns={columns}
      rows={reports}
      getRowId={(row) => row.id}
      loading={isLoading}
      error={isError ? errorMessage || LABELS.bugCouldNotLoad : null}
      emptyMessage={emptyMessage}
      onRefresh={onRefresh}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={onLoadMore}
      onRowClick={(row) => router.push(detailHref(row.id))}
    />
  )
}
