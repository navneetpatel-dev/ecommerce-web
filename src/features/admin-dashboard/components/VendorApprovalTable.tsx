'use client'

import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { useClientPagination } from '@/shared/hooks/useClientPagination'
import { ModerationRowActions } from './ModerationRowActions'

interface Vendor {
  id: string
  businessName: string
  slug: string
}

interface VendorApprovalTableProps {
  vendors: Vendor[]
  onApprove: (id: string) => void | Promise<unknown>
  onReject: (id: string, reason: string) => void | Promise<unknown>
  isApproving?: boolean
  isRejecting?: boolean
  loading?: boolean
}

export function VendorApprovalTable({
  vendors,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  loading = false,
}: VendorApprovalTableProps) {
  const pagination = useClientPagination(vendors)

  const columns: DataTableColumn<Vendor>[] = [
    {
      id: 'businessName',
      header: LABELS.businessName,
      className: 'font-medium',
      accessor: 'businessName',
    },
    {
      id: 'slug',
      header: LABELS.slug,
      className: 'text-ink-muted',
      accessor: 'slug',
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
      actions={(v) => (
        <ModerationRowActions
          approveTitle={LABELS.confirmApproveVendorTitle}
          approveDescription={formatLabel(LABELS.confirmApproveVendorBody, {
            name: v.businessName,
          })}
          rejectTitle={LABELS.confirmRejectVendorTitle}
          rejectDescription={formatLabel(LABELS.confirmRejectVendorBody, {
            name: v.businessName,
          })}
          rejectFieldLabel={LABELS.reasonRequired}
          rejectEmptyHint={LABELS.enterRejectionReason}
          onConfirmApprove={() => onApprove(v.id)}
          onConfirmReject={(reason) => onReject(v.id, reason)}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}
    />
  )
}
