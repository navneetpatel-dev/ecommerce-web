'use client'

import {
  DataTable,
  type DataTableColumn,
  type DataTablePaginationProps,
} from '@/shared/components/DataTable'
import { MediaImage } from '@/shared/components/MediaImage'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { LABELS } from '@/shared/constants/labels'
import { CATEGORY_STATUS } from '@/shared/constants/statuses'
import type { Category } from '@/shared/api/types'
import type { ReactNode } from 'react'

interface CategoriesTableProps {
  categories: Category[]
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
  pagination?: DataTablePaginationProps
  actions?: (row: Category) => ReactNode
}

export function CategoriesTable({
  categories,
  loading = false,
  error = null,
  onRefresh,
  pagination,
  actions,
}: CategoriesTableProps) {
  const columns: DataTableColumn<Category>[] = [
    {
      id: 'image',
      header: LABELS.imageUrl,
      truncate: false,
      className: 'w-14',
      cell: (row) => (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-paper">
          <MediaImage
            src={row.imageUrl}
            alt={row.name}
            unavailableLabel={LABELS.imageNotAvailable}
            sizes="40px"
            imageClassName="object-cover"
          />
        </div>
      ),
    },
    {
      id: 'name',
      header: LABELS.name,
      className: 'font-medium',
      accessor: 'name',
    },
    {
      id: 'slug',
      header: LABELS.slug,
      className: 'text-ink-muted font-mono text-[0.8125rem]',
      accessor: 'slug',
    },
    {
      id: 'status',
      header: LABELS.status,
      truncate: false,
      cell: (row) => (
        <StatusBadge
          status={row.status || CATEGORY_STATUS.ACTIVE}
          label={
            row.status === CATEGORY_STATUS.ARCHIVED
              ? LABELS.categoryStatusArchived
              : LABELS.categoryStatusActive
          }
        />
      ),
    },
    {
      id: 'parent',
      header: LABELS.parentName,
      cell: (row) => row.parent?.name || LABELS.parentCategoryNone,
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={categories}
      loading={loading}
      error={error}
      emptyMessage={LABELS.noRecordsFound}
      onRefresh={onRefresh}
      getRowId={(row) => row.id}
      pagination={pagination}
      actions={actions}
      actionsClassName="w-auto min-w-[11rem]"
    />
  )
}
