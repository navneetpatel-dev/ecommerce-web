'use client'

import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { MediaImage } from '@/shared/components/MediaImage'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { useClientPagination } from '@/shared/hooks/useClientPagination'
import { ModerationRowActions } from './ModerationRowActions'

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
}

export function ProductModerationTable({
  products,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  loading = false,
}: ProductModerationTableProps) {
  const pagination = useClientPagination(products)

  const columns: DataTableColumn<Product>[] = [
    {
      id: 'product',
      header: LABELS.product,
      truncate: false,
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-paper">
            <MediaImage src={p.imageUrl} alt={p.name} sizes="40px" imageClassName="object-cover" />
          </div>
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

  return (
    <DataTable
      columns={columns}
      rows={pagination.pageRows}
      loading={loading}
      getRowId={(row) => row.id}
      actionsClassName="w-56"
      pagination={{
        page: pagination.page,
        totalPages: pagination.totalPages,
        total: pagination.total,
        from: pagination.from,
        to: pagination.to,
        onPageChange: pagination.onPageChange,
      }}
      actions={(p) => (
        <ModerationRowActions
          approveTitle={LABELS.confirmApproveProductTitle}
          approveDescription={formatLabel(LABELS.confirmApproveProductBody, { name: p.name })}
          rejectTitle={LABELS.confirmRejectProductTitle}
          rejectDescription={formatLabel(LABELS.confirmRejectProductBody, { name: p.name })}
          rejectFieldLabel={LABELS.rejectionNote}
          rejectEmptyHint={LABELS.enterRejectionNote}
          onConfirmApprove={() => onApprove(p.id)}
          onConfirmReject={(note) => onReject(p.id, note)}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}
    />
  )
}
