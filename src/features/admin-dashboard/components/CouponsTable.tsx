'use client'

import { DataTable, type DataTableColumn, type DataTablePaginationProps } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { LABELS } from '@/shared/constants/labels'
import { formatDateTime } from '@/shared/utils/formatDate'
import type { Coupon } from '@/shared/api/types'

interface CouponsTableProps {
  coupons?: Coupon[]
  loading?: boolean
  pagination?: DataTablePaginationProps
}

export function CouponsTable({ coupons = [], loading = false, pagination }: CouponsTableProps) {
  const columns: DataTableColumn<Coupon>[] = [
    {
      id: 'code',
      header: LABELS.couponCode,
      className: 'font-mono',
      cell: (row) => row.code,
    },
    {
      id: 'type',
      header: LABELS.couponType,
      accessor: 'type',
    },
    {
      id: 'usage',
      header: LABELS.couponUsage,
      className: 'font-mono text-[0.8125rem]',
      truncate: false,
      cell: (row) => `${row.usedCount}/${row.usageLimitTotal ?? '∞'}`,
    },
    {
      id: 'status',
      header: LABELS.status,
      truncate: false,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'expires',
      header: LABELS.expires,
      cell: (row) => formatDateTime(row.endDate),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={coupons}
      loading={loading}
      emptyMessage={LABELS.noCoupons}
      getRowId={(row) => row.id}
      pagination={pagination}
    />
  )
}
