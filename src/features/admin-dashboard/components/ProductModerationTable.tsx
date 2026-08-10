'use client'

import { DataTable, type DataTableColumn, type DataTablePaginationProps } from '@/shared/components/DataTable'
import { TableCellImage } from '@/shared/components/TableCellImage'
import { TableRowAction } from '@/shared/components/TableRowActions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { AdminConfirmAction } from './AdminConfirmAction'

interface Product {
  id: string
  name: string
  imageUrl?: string | null
  basePrice: number
}

interface ProductModerationTableProps {
  products: Product[]
  onApprove: (id: string) => void | Promise<unknown>
  onReject: (id: string, note: string) => void | Promise<unknown>
  isApproving?: boolean
  isRejecting?: boolean
  loading?: boolean
  onRefresh?: () => void
  pagination?: DataTablePaginationProps
}

export function ProductModerationTable({
  products,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  loading = false,
  onRefresh,
  pagination,
}: ProductModerationTableProps) {
  const columns: DataTableColumn<Product>[] = [
    {
      id: 'product',
      header: LABELS.product,
      truncate: false,
      cell: (p) => (
        <div className="flex items-center gap-3">
          <TableCellImage src={p.imageUrl} alt={p.name} />
          <span className="font-medium">{p.name}</span>
        </div>
      ),
    },
    {
      id: 'price',
      header: LABELS.price,
      className: 'font-mono',
      cell: (p) => `₹${p.basePrice}`,
    },
  ]

  const rowBusy = isApproving || isRejecting

  return (
    <DataTable
      columns={columns}
      rows={products}
      loading={loading}
      onRefresh={onRefresh}
      getRowId={(row) => row.id}
      pagination={pagination}
      actions={(p) => (
        <>
          <TableRowAction>
            <AdminConfirmAction
              label={LABELS.approve}
              tone="success"
              dialogVariant="success"
              title={LABELS.confirmApproveProductTitle}
              description={formatLabel(LABELS.confirmApproveProductBody, { name: p.name })}
              confirmLabel={LABELS.approve}
              onConfirm={() => onApprove(p.id)}
              disabled={rowBusy}
            />
          </TableRowAction>
          <TableRowAction destructive>
            <AdminConfirmAction
              label={LABELS.reject}
              tone="danger"
              dialogVariant="danger"
              title={LABELS.confirmRejectProductTitle}
              description={formatLabel(LABELS.confirmRejectProductBody, { name: p.name })}
              confirmLabel={LABELS.reject}
              requireReason
              reasonLabel={LABELS.rejectionNote}
              reasonHint={LABELS.enterRejectionNote}
              onConfirm={(note) => onReject(p.id, note ?? '')}
              disabled={rowBusy}
            />
          </TableRowAction>
        </>
      )}
    />
  )
}
