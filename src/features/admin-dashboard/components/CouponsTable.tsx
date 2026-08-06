'use client'

import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { LABELS } from '@/shared/constants/labels'
import { useClientPagination } from '@/shared/hooks/useClientPagination'
import type { Coupon } from '@/shared/api/types'

interface CouponsTableProps {
  coupons?: Coupon[]
  loading?: boolean
}

export function CouponsTable({ coupons = [], loading = false }: CouponsTableProps) {
  const pagination = useClientPagination(coupons)

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
      cell: (row) => new Date(row.endDate).toLocaleDateString(),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={pagination.pageRows}
      loading={loading}
      emptyMessage={LABELS.noCoupons}
      getRowId={(row) => row.id}
      pagination={{
        page: pagination.page,
        totalPages: pagination.totalPages,
        total: pagination.total,
        from: pagination.from,
        to: pagination.to,
        onPageChange: pagination.onPageChange,
      }}
    />
  )
}
